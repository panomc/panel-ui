<script>
  import {
    currentServerPlatformMatchKey,
    platformKeyRefreshedTime,
    platformAddress,
    showNetworkErrorOnCatch,
  } from "../../Store";
  import { ApiUtil } from "../../util/api.util";
  import tooltip from "../../util/tooltip.util";

  import Icon from "svelte-awesome";
  import {
    faDownload,
    faTerminal,
    faFileDownload,
    faHourglassHalf,
    faClipboard,
    faCheckCircle,
  } from "@fortawesome/free-solid-svg-icons";
  import { faBell } from "@fortawesome/free-regular-svg-icons";

  import { onDestroy } from "svelte";
  import { get } from "svelte/store";
  import copy from "copy-to-clipboard";
  import moment from "moment";

  let timeToRefreshKey = "...";
  let commandText;
  let isCommandTextCopied = false;
  let copyClickIDForCommandText = 0;
  let firstStartCountDown = false;

  function getTimeLeftInSeconds() {
    const now = moment(new Date()); //todays date
    const end = moment(get(platformKeyRefreshedTime)); // another date
    const duration = moment.duration(now.diff(end));

    return 30 - Math.round(duration.asSeconds());
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
    showNetworkErrorOnCatch(
      () =>
        new Promise((resolve, reject) => {
          ApiUtil.get("panel/platformAuth/refreshKey")
            .then((response) => {
              if (response.data.result === "ok") {
                currentServerPlatformMatchKey.set(response.data.key);
                platformKeyRefreshedTime.set(response.data.timeStarted);
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
        })
    );
  }

  function updateCommandText() {
    commandText =
      "/pano connect " +
      get(platformAddress) +
      " " +
      get(currentServerPlatformMatchKey);
  }

  const platformKeyRefreshedTimeUnsubscribe = platformKeyRefreshedTime.subscribe(
    (value) => {
      if (value !== 0 && !firstStartCountDown) {
        firstStartCountDown = true;

        startCountDown();
      }
    }
  );

  const platformAddressUnsubscribe = platformAddress.subscribe(() => {
    updateCommandText();
  });

  const currentServerPlatformMatchKeyUnsubscribe = currentServerPlatformMatchKey.subscribe(
    () => {
      updateCommandText();
    }
  );

  onDestroy(platformAddressUnsubscribe);
  onDestroy(currentServerPlatformMatchKeyUnsubscribe);
  onDestroy(platformKeyRefreshedTimeUnsubscribe);

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
</script>

<!-- Connect Server Modal -->
<div
  aria-hidden="true"
  class="modal fade"
  id="connectServer"
  role="document"
  tabindex="-1"
>
  <div class="modal-dialog" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title">Sunucu Bağla</h5>
        <button
          class="close"
          data-dismiss="modal"
          title="Pencereyi Kapat"
          type="button"
        >
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body">
        <div class="card-body text-center">

          <div class="mb-3">
            <Icon data="{faDownload}" scale="3" class="text-primary" />
          </div>

          <h5 class="text-primary" for="downloadPlugin">
            1. Oyun Eklentisini Sunucunuza İndirin:
          </h5>
          <button class="btn btn-link bg-light">
            <Icon data="{faFileDownload}" class="mr-1" />
            Pano Minecraft Eklentisini İndir
            <br />
            <small>BungeeCord, Bukkit, Spigot, PaperSpigot</small>
          </button>

          <div class="my-4">
            <Icon data="{faTerminal}" scale="3" class="text-primary" />
          </div>

          <h5 class="text-primary" for="platformToken">
            2. Bağlantı Komutunu Çalıştırın:
          </h5>
          <div class="input-group mb-2">
            <input
              bind:value="{commandText}"
              class="form-control shadow-sm"
              id="platformToken"
              type="text"
            />
            <div class="input-group-append">
              <button
                on:click="{onCopyCommandTextClick}"
                class="btn btn-link bg-light border shadow-sm"
                id="copyPlatformToken"
                type="button"
                use:tooltip="{['top', isCommandTextCopied ? 'Kopyalandı!' : 'Kopyala']}"
              >
                <Icon data="{faClipboard}" />
              </button>
            </div>
          </div>
          <small class="text-muted">
            Kod {timeToRefreshKey}{timeToRefreshKey === '...' ? '' : ' saniye'}
            sonra yenilenecek.
          </small>

          <div class="my-4">
            <Icon data="{faCheckCircle}" scale="3" class="text-primary" />
          </div>

          <h5 class="text-primary">3. Bağlantı İsteğine Onay Verin:</h5>
          <p class="mb-0">
            Bildirim panelinden (
            <Icon data="{faBell}" />
            ) "Sunucu Bağlantısı İsteği" bildirimini açarak, onay verin.
          </p>

        </div>
      </div>
    </div>
  </div>
</div>
