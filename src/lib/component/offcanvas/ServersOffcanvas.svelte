<!-- Servers Offcanvas -->
<div class="offcanvas offcanvas-top" id="showServers" tabindex="-1">
  <div class="offcanvas-header">
    <div class="row">
      <div class="col-auto">
        <h5 class="offcanvas-title pr-2">Sunucular</h5>
      </div>
      <div class="col-auto">
        <button
          class="btn btn-secondary btn-sm"
          data-bs-target="#connectServer"
          data-bs-toggle="modal">
          <i class="fa-solid fa-plus me-2"></i> Sunucu Bağla
        </button>
      </div>
    </div>
    <button
      aria-label="Kapat"
      class="btn-close"
      data-bs-dismiss="offcanvas"
      title="Pencereyi Kapat"
      type="button">
    </button>
  </div>
  <div class="offcanvas-body">
    {#if serverListLoading}
      <div class="spinner-border text-primary" role="status"></div>
    {/if}

    <!-- Server Card -->
    Server Card

    <!-- No Server -->
    {#if $servers.length === 0}
      <div class="container text-center animate__animated animate__zoomIn">
        <i class="fas fa-cube fa-3x m-3 text-dark text-opacity-25"></i>
        <p class="text-gray">Burada içerik yok.</p>
      </div>
    {/if}
  </div>
</div>

<script>
  import { servers } from "$lib/Store";

  import ApiUtil, { NETWORK_ERROR } from "$lib/api.util";

  let serverListLoading = false;

  function getServerList() {
    return new Promise((resolve, reject) => {
      ApiUtil.get({
        path: "/api/panel/server/list",
      })
        .then((body) => {
          if (body.result === "ok") {
            resolve(body);
          } else if (body.result === "error") {
            const error = body.error;

            reject(error);
          } else {
            reject(NETWORK_ERROR);
          }
        })
        .catch(() => {
          reject(NETWORK_ERROR);
        });
    });
  }

  function reloadServerList() {
    serverListLoading = true;

    getServerList()
      .then((body) => {
        serverListLoading = false;

        servers.set(body.servers);
      })
      .catch(() => {
        serverListLoading = false;
      });
  }
</script>
