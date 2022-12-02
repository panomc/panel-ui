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
        <h5 class="modal-title">Sunucu Bağla</h5>
        <button
          class="btn-close"
          data-bs-dismiss="modal"
          title="Pencereyi Kapat"
          type="button">
        </button>
      </div>
      <div class="modal-body">
        <div class="card-body text-center">
          <div class="mb-3">
            <i class="fas fa-download fa-3x text-primary"></i>
          </div>

          <h5 class="text-primary">1. Oyun Eklentisini Sunucunuza İndirin:</h5>
          <button class="btn btn-outline-primary"> Dosyayı İndir </button>

          <div class="my-4">
            <i class="fas fa-terminal fa-3x text-primary"></i>
          </div>

          <h5 class="text-primary">2. Bağlantı Komutunu Çalıştırın:</h5>
          <div class="input-group">
            <input
              bind:value="{commandText}"
              class="form-control user-select-all"
              id="platformToken"
              type="text" />
            <button
              on:click="{onCopyCommandTextClick}"
              class="btn btn-outline-gray link-primary"
              id="copyPlatformToken"
              type="button"
              use:tooltip="{[
                isCommandTextCopied ? 'Kopyalandı!' : 'Kopyala',
                { placement: 'top', hideOnClick: false },
              ]}">
              <i class="fas fa-clipboard"></i>
            </button>
          </div>
          <small class="text-muted">
            Kod {timeToRefreshKey} saniye sonra yenilenecek.
          </small>

          <div class="my-4">
            <i class="fas fa-check-circle fa-3x text-primary"></i>
          </div>

          <h5 class="text-primary">3. Bağlantı İsteğine Onay Verin:</h5>
          <p class="mb-0">
            Bildirim panelinden
            <i class="fas fa-bell"></i>
            "Sunucu Bağlantısı İsteği" bildirimini açarak, onay verin.
          </p>
        </div>
      </div>
    </div>
  </div>
</div>

<script>
  import { onDestroy } from "svelte";
  import { get } from "svelte/store";
  import copy from "copy-to-clipboard";
  import { differenceInSeconds } from "date-fns";

  import { browser } from "$app/environment";

  import ApiUtil from "$lib/api.util";
  import tooltip from "$lib/tooltip.util";

  import {
    currentServerPlatformMatchKey,
    platformKeyRefreshedTime,
    platformAddress,
    showNetworkErrorOnCatch,
  } from "$lib/Store";

  let timeToRefreshKey = "...";
  let commandText;
  let isCommandTextCopied = false;
  let copyClickIDForCommandText = 0;
  let firstStartCountDown = false;

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
            currentServerPlatformMatchKey.set(body.key);
            platformKeyRefreshedTime.set(body.timeStarted);
          } else {
            currentServerPlatformMatchKey.set("");
          }

          if (firstStartCountDown) startCountDown();

          resolve();
        })
        .catch(() => {
          currentServerPlatformMatchKey.set("");

          reject();
        });
    });
  }

  function updateCommandText() {
    commandText =
      "/pano connect " +
      get(platformAddress) +
      " " +
      get(currentServerPlatformMatchKey);
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
      platformAddress.subscribe(() => {
        updateCommandText();
      })
    );

    onDestroy(
      currentServerPlatformMatchKey.subscribe(() => {
        updateCommandText();
      })
    );
  }
</script>
