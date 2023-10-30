<!-- Connect Server Modal -->
<div
  aria-hidden="true"
  class="modal fade"
  id="connectServer"
  role="document"
  tabindex="-1">
  <div class="modal-dialog" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title">
          {$_("components.modals.connect-server.title")}
        </h5>
        <button
          class="btn-close"
          data-bs-dismiss="modal"
          title="{$_('components.modals.connect-server.close')}"
          type="button">
        </button>
      </div>
      <div class="modal-body">
        <ol class="list-group list-group-numbered">
          <a href="#" class="list-group-item list-group-item-action"  
          use:tooltip="{[$_('components.modals.connect-server.download'), { placement: 'bottom' }]}">
            <i class="fas fa-download me-2"></i>
            {$_("components.modals.connect-server.steps.1")}
          </a>

          <button
            type="button"
            class="list-group-item list-group-item-action fw-normal"
            on:click="{onCopyCommandTextClick}"
            id="copyPlatformToken"
            use:tooltip="{[
              isCommandTextCopied
                ? $_('components.modals.connect-server.copied')
                : $_('components.modals.connect-server.copy'),
              { placement: 'bottom', hideOnClick: false },
            ]}">
            <i class="fas fa-terminal me-2"></i>
            {$_("components.modals.connect-server.steps.2")}
            <span class="d-block user-select-all font-monospace"
              >{commandText}</span>
            <small class="text-muted">
              {$_("components.modals.connect-server.code-refresh", {
                values: { timeToRefreshKey },
              })}
            </small>
          </button>

          <a href="#" class="list-group-item list-group-item-action">
            <i class="fas fa-check-circle me-2"></i>
            {$_("components.modals.connect-server.steps.3")}
          </a>
        </ol>
      </div>
    </div>
  </div>
</div>

<script>
  import { getContext, onDestroy } from "svelte";
  import { get } from "svelte/store";
  import copy from "copy-to-clipboard";
  import { differenceInSeconds } from "date-fns";

  import { browser } from "$app/environment";

  import ApiUtil from "$lib/api.util";
  import tooltip from "$lib/tooltip.util";

  import { showNetworkErrorOnCatch } from "$lib/Store";
  import { _ } from "svelte-i18n";

  let timeToRefreshKey = "...";
  let commandText;
  let isCommandTextCopied = false;
  let copyClickIDForCommandText = 0;
  let firstStartCountDown = false;

  const platformServerMatchKey = getContext("platformServerMatchKey");
  const platformKeyRefreshedTime = getContext("platformKeyRefreshedTime");
  const platformHostAddress = getContext("platformHostAddress");

  function getTimeLeftInSeconds() {
    const now = new Date(); // current time
    const end = new Date(get(platformKeyRefreshedTime)); // future time

    const difference = differenceInSeconds(now, end);

    return 30 - difference;
  }

  function startCountDown() {
    timeToRefreshKey = getTimeLeftInSeconds();

    const timer = setInterval(() => {
      if (timeToRefreshKey > 0) {
        timeToRefreshKey--;
      } else {
        clearInterval(timer);

        timeToRefreshKey = "...";

        refreshKey();
      }
    }, 1000);
  }

  function refreshKey() {
    showNetworkErrorOnCatch((resolve, reject) => {
      ApiUtil.get({
        path: "/api/panel/platformAuth/refreshKey",
      })
        .then((body) => {
          if (body.error) {
            reject();

            return;
          }

          if (body.result === "ok") {
            platformServerMatchKey.set(body.key);
            platformKeyRefreshedTime.set(body.timeStarted);
          } else {
            platformServerMatchKey.set("");
          }

          if (firstStartCountDown) startCountDown();

          resolve();
        })
        .catch(() => {
          platformServerMatchKey.set("");

          reject();
        });
    });
  }

  function updateCommandText() {
    commandText =
      "/pano connect " +
      get(platformHostAddress) +
      " " +
      get(platformServerMatchKey);
  }

  function onCopyCommandTextClick() {
    copyClickIDForCommandText++;

    const id = copyClickIDForCommandText;

    copy(commandText);

    isCommandTextCopied = true;

    setTimeout(function () {
      if (copyClickIDForCommandText === id) {
        isCommandTextCopied = false;
      }
    }, 1000);
  }

  if (browser) {
    onDestroy(
      platformKeyRefreshedTime.subscribe((value) => {
        if (value !== 0 && !firstStartCountDown) {
          firstStartCountDown = true;

          startCountDown();
        }
      })
    );

    onDestroy(
      platformHostAddress.subscribe(() => {
        updateCommandText();
      })
    );

    onDestroy(
      platformServerMatchKey.subscribe(() => {
        updateCommandText();
      })
    );
  }
</script>
