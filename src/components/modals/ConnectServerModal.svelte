<script>
  import {currentServerPlatformMatchKey, platformAddress} from "../../Store";
  import {ApiUtil} from "../../util/api.util";

  import {onMount, onDestroy} from "svelte";

  let timeToRefreshKey = "...";
  let commandText;

  function startCountDown() {
    timeToRefreshKey = 30;

    const timer = setInterval(() => {
      if (timeToRefreshKey > 0) {
        timeToRefreshKey--
      } else {
        clearInterval(timer);

        timeToRefreshKey = "...";

        refreshKey();
      }
    }, 1000)
  }

  function refreshKey() {
    ApiUtil.get("panel/platformAuth/refreshKey")
      .then(response => {
        if (response.data.result === "ok") {
          currentServerPlatformMatchKey.set(response.data.key);
        } else {
          currentServerPlatformMatchKey.set("")
        }

        startCountDown()
      })
      .catch(() => {
        currentServerPlatformMatchKey.set("");

        startCountDown()
      });
  }

  onMount(async () => {
    startCountDown();
  })

  function updateCommandText() {
    commandText = "/pano connect " + $platformAddress + " " + $currentServerPlatformMatchKey;
  }

  const platformAddressUnsubscribe = platformAddress.subscribe(() => {
    updateCommandText();
  });

  const currentServerPlatformMatchKeyUnsubscribe = currentServerPlatformMatchKey.subscribe(() => {
    updateCommandText();
  });

  onDestroy(platformAddressUnsubscribe);
  onDestroy(currentServerPlatformMatchKeyUnsubscribe);
</script>

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
          class="close"
          data-dismiss="modal"
          title="Pencereyi Kapat"
          type="button">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body">
        <div class="card-body text-center">

          <div class="mb-3">
            <i class="fa fa-download fa-3x text-primary" aria-hidden="true"/>
          </div>

          <h5 class="text-primary" for="downloadPlugin">
            1. Oyun Eklentisini Sunucunuza İndirin:
          </h5>
          <button class="btn btn-link bg-light">
            <i aria-hidden="true" class="fas fa-file-download fa-fw"/>
            Pano Minecraft Eklentisini İndir
            <br/>
            <span class="font-weight-normal small">
              BungeeCord, Bukkit, Spigot, PaperSpigot
            </span>
          </button>

          <div class="my-4">
            <i class="fa fa-terminal fa-3x text-primary" aria-hidden="true"/>
          </div>

          <h5 class="text-primary" for="platformToken">
            2. Bağlantı Komutunu Çalıştırın:
          </h5>
          <div class="input-group mb-2">
            <input
              bind:value={commandText}
              class="form-control shadow-sm"
              id="platformToken"
              type="text"/>
            <div class="input-group-append">
              <!--              @click="onCopyPlatformMatchKeyClick"-->
              <button
                class="btn btn-link bg-light border shadow-sm"
                id="copyPlatformToken"
                type="button"
                v-tooltip:top="isPlatformMatchKeyCopied ? 'Kopyalandı!' :
                'Kopyala'">
                <i aria-hidden="true" class="fa fa-clipboard fa-fw"/>
              </button>
            </div>
          </div>
          <small class="text-muted ml-2">
            <i aria-hidden="true" class="fa fa-hourglass-half fa-fw"/>
            Kod {timeToRefreshKey}{timeToRefreshKey === '...' ? '' : ' saniye'} sonra yenilenecek.
          </small>

          <div class="my-4">
            <i
              class="fa fa-check-circle fa-3x text-primary"
              aria-hidden="true"/>
          </div>

          <h5 class="text-primary">3. Bağlantı İsteğine Onay Verin:</h5>
          <p class="mb-0">
            Bildirim panelinden (
            <i aria-hidden="true" class="far fa-bell"/>
            ) "Sunucu Bağlantısı İsteği" bildirimini açarak, onay verin.
          </p>

        </div>
      </div>
    </div>
  </div>
</div>
