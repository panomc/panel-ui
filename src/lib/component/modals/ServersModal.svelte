<!-- Servers Modal -->
<div
  class="modal fade"
  aria-hidden="true"
  id="showServers"
  role="dialog"
  data-bs-scroll="true"
  tabindex="-1">
  <div class="modal-dialog modal-xl">
    <div class="modal-content">
      <div class="modal-header">
        <div class="row justify-content-between w-100">
          <div class="col-4">
            <button
              class="btn btn-secondary btn-sm"
              data-bs-target="#connectServer"
              data-bs-toggle="modal">
              <i class="fa-solid fa-plus"></i>
              <span class="d-lg-inline d-none ms-2"> Sunucu Bağla</span>
            </button>
          </div>
          <div class="col-4 d-flex justify-content-center align-items-center">
            <h5 class="modal-title pr-2">Sunucular</h5>
          </div>
          <div class="col-4 d-flex align-items-center">
            <button
              aria-label="Kapat"
              class="btn-close"
              data-bs-dismiss="modal"
              title="Pencereyi Kapat"
              type="button">
            </button>
          </div>
        </div>
      </div>

      <div class="modal-body">
        {#if serverListLoading}
          <div class="spinner-border text-primary" role="status"></div>
        {/if}

        <div class="row">
          <!-- Server Card Selected -->
          <div class="col-xl-3 col-6 mb-2">
            <a
              href="#"
              class="card bg-light text-bg-light border border-3 border-primary animate__animated animate__fadeIn">
              <div class="card-body text-center">
                <img
                  src="https://icons.iconarchive.com/icons/chrisl21/minecraft/64/Crafting-Table-icon.png"
                  class="rounded mb-3"
                  height="64"
                  width="64"
                  alt="SUNUCU ADI" />
                <h6 class="card-title">SUNUCU IP</h6>
                <p class="card-text text-muted">32/140</p>
                <small class="badge bg-white text-black rounded-pill"
                  >Spigot</small>
              </div>
            </a>
          </div>
          <!-- Server Card Unselected -->

          <div class="col-xl-3 col-6 mb-2">
            <a
              href="#"
              class="card bg-light text-bg-light border-3 animate__animated animate__fadeIn">
              <div class="card-body text-center">
                <img
                  src="https://icons.iconarchive.com/icons/chrisl21/minecraft/64/Crafting-Table-icon.png"
                  class="rounded mb-3"
                  height="64"
                  width="64"
                  alt="SUNUCU ADI" />
                <h6 class="card-title">SUNUCU IP</h6>
                <p class="card-text text-muted">32/140</p>
                <small class="badge bg-white text-black rounded-pill"
                  >Spigot</small>
              </div>
            </a>
          </div>
        </div>
      </div>

      <!-- No Server -->
      {#if $servers.length === 0}
        <div
          class="container text-center animate__animated animate__zoomIn d-none">
          <i class="fas fa-cube fa-3x m-3 text-dark text-opacity-25"></i>
          <p class="text-gray">Burada içerik yok.</p>
        </div>
      {/if}
    </div>
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
