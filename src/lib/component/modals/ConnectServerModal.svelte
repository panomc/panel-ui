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
        <h5 class="modal-title">{$_('components.modals.connect-server.title')}</h5>
        <button
          class="btn-close"
          data-bs-dismiss="modal"
          title="{$_('components.modals.connect-server.close')}"
          type="button">
        </button>
      </div>
      <div class="modal-body">
        <div class="card-body text-center">
          <div class="mb-3">
            <i class="fas fa-download fa-3x text-primary"></i>
          </div>

          <h5 class="text-primary">{$_('components.modals.connect-server.steps.1')}</h5>
          <button class="btn btn-secondary">
            <i class="fa-solid fa-download me-2"></i>
            {$_('components.modals.connect-server.download')}
          </button>

          <div class="my-4">
            <i class="fas fa-terminal fa-3x text-primary"></i>
          </div>

          <h5 class="text-primary">{$_('components.modals.connect-server.steps.2')}</h5>
          <div class="input-group">
            <input
              bind:value="{commandText}"
              class="form-control border-primary user-select-all"
              id="platformToken"
              type="text" />
            <button
              on:click="{onCopyCommandTextClick}"
              class="btn btn-outline-primary"
              id="copyPlatformToken"
              type="button"
              use:tooltip="{[
                isCommandTextCopied ? $_('components.modals.connect-server.copied') : $_('components.modals.connect-server.copy'),
                { placement: 'top', hideOnClick: false },
              ]}">
              <i class="fas fa-clipboard"></i>
            </button>
          </div>
          <small class="text-muted">
            {$_('components.modals.connect-server.code-refresh', {values:{timeToRefreshKey}})}
          </small>

          <div class="my-4">
            <i class="fas fa-check-circle fa-3x text-primary"></i>
          </div>

          <h5 class="text-primary">{$_('components.modals.connect-server.steps.3')}</h5>
          <p class="mb-0">{$_('components.modals.connect-server.notification-will-come')}</p>
        </div>
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
