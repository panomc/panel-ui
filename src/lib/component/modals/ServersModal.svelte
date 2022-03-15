<!-- Servers Modal -->
<div
  aria-hidden="true"
  class="modal fade"
  id="showServers"
  role="dialog"
  tabindex="-1"
>
  <div class="modal-dialog modal-xl">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title">Sunucular</h5>
        <button
          class="btn btn-link bg-light btn-sm mx-3"
          data-dismiss="modal"
          data-bs-target="#connectServer"
          data-bs-toggle="modal"
          type="button"
        >
          <i class="fas fa-plus mr-1"></i>
          Sunucu Bağla
        </button>
        <button
          aria-label="Kapat"
          class="btn-close"
          data-bs-dismiss="modal"
          title="Pencereyi Kapat"
          type="button"
        >
        </button>
      </div>
      <div class="modal-body">
        <div class="row">
          {#if serverListLoading}
            <div class="spinner-border text-primary mr-1" role="status"></div>
          {/if}

          <!-- Server Card -->
          {#if !serverListLoading && $servers.length > 0}
            {#each $servers as server}
              <div class="col-lg-4 col-md-6">
                <!--            :class="{ 'selected': selectedServer.id === server.id }"-->
                <div class="card w-100">
                  <!--              @click="selectServer(server)"-->
                  <a href="javascript:void(0);">
                    <div class="card-img-top bg-primary border-0">
                      <div class="card-body">
                        <h4 class="card-title text-white lead">
                          <i class="fas fa-home mr-1 text-light"></i>
                          {server.name} Panocraft
                        </h4>
                        <h5 class="badge bg-sunflower">Spigot</h5>
                      </div>
                    </div>
                    <div class="position-relative">
                      <div class="position-absolute w-100" style="top: -60px;">
                        <img
                          src=""
                          width="72"
                          height="72"
                          alt=" Sever İkon"
                          class="d-block m-auto border rounded-circle shadow-sm
                          bg-white p-1 text-center"
                        />
                      </div>
                      <div
                        class="mt-4 card-body text-center text-dark d-flex
                        flex-row justify-content-between"
                      >
                        <div>
                          <span class="lead">
                            {server.status === "online"
                              ? server.playerCount
                              : 0}
                            / {server.maxPlayerCount}
                          </span>
                          <br />
                          <strong>Oyuncu</strong>
                        </div>
                        <div>
                          <div>
                            <span class="lead">14 ms.</span>
                            <br />
                            <strong>Gecikme</strong>
                          </div>
                        </div>
                        <div>
                          <span class="text-dark lead">1.14</span>
                          <br />
                          <strong>Sürüm</strong>
                        </div>
                      </div>
                    </div>
                  </a>
                  <div class="card-footer bg-lightprimary text-center">
                    <div class="dropup">
                      <button
                        aria-expanded="false"
                        aria-haspopup="true"
                        class="btn btn-link btn-block"
                        data-toggle="dropdown"
                        id="serverOptions"
                        title="Seçenekler"
                        type="button"
                      >
                        <i class="fas fa-cog mr-1"></i>
                      </button>
                      <div
                        aria-labelledby="serverOptions"
                        class="dropdown-menu animate__animated animate__zoomInLeft"
                      >
                        <a
                          class="dropdown-item"
                          href="javascript:void(0);"
                          v-if="main_server.id !== server.id"
                        >
                          <i class="fas fa-home mr-1 text-primary"></i>
                          Ana Sunucu Olarak Belirle
                        </a>

                        <a
                          class="dropdown-item"
                          href="javascript:void(0);"
                          v-if="main_server.id === server.id"
                        >
                          <i class="fas fa-times mr-1 text-primary"></i>
                          Ana Sunuculuğunu Kaldır
                        </a>
                        <!--                    @click="onRemoveClick(server)"-->
                        <a
                          class="dropdown-item"
                          data-dismiss="modal"
                          data-target="#confirmRemoveServer"
                          data-toggle="modal"
                          href="javascript:void(0);"
                        >
                          <i class="fas fa-times mr-1 text-danger"></i>
                          Sunucuyu Kaldır
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            {/each}
          {/if}

          <!-- No Server -->
          {#if $servers.length === 0}
            <div
              class="container text-center animate__animated animate__zoomIn"
            >
              <i class="fas fa-cube fa-3x m-3 text-dark text-opacity-25"></i>
              <p class="text-gray">Bağlı sunucu yok.</p>
            </div>
          {/if}
        </div>
      </div>
    </div>
  </div>
</div>

<script>
  import { servers } from "$lib/store";
  import { session } from "$app/stores";

  import ApiUtil, { NETWORK_ERROR } from "$lib/api.util";

  let serverListLoading = false;

  function getServerList() {
    return new Promise((resolve, reject) => {
      ApiUtil.get({
        path: "/api/panel/server/list",
        CSRFToken: $session.CSRFToken,
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
