<script>
  import { servers } from "../../Store";
  import { NETWORK_ERROR } from "../../pano-ui/js/api.util";

  import Icon from "svelte-awesome";
  import {
    faPlus,
    faCog,
    faTimes,
    faHome,
    faCube,
  } from "@fortawesome/free-solid-svg-icons";
  import { faBell } from "@fortawesome/free-regular-svg-icons";

  let serverListLoading = false;

  function getServerList() {
    return new Promise((resolve, reject) => {
      ApiUtil.get("/api/panel/server/list")
        .then((response) => {
          if (response.data.result === "ok") {
            resolve(response);
          } else if (response.data.result === "error") {
            const error = response.data.error;

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
      .then((response) => {
        serverListLoading = false;

        servers.set(response.data.servers);
      })
      .catch(() => {
        serverListLoading = false;
      });
  }
</script>

<!-- Servers Modal -->
<div
  aria-hidden="true"
  class="modal fade"
  id="showServers"
  role="dialog"
  tabindex="-1">
  <div class="modal-dialog modal-xl" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title">Sunucular</h5>
        <button
          class="btn btn-link bg-light btn-sm ml-3"
          data-dismiss="modal"
          data-target="#connectServer"
          data-toggle="modal"
          type="button">
          <Icon data="{faPlus}" class="mr-2" />
          Sunucu Bağla
        </button>
        <button
          aria-label="Kapat"
          class="close"
          data-dismiss="modal"
          title="Pencereyi Kapat"
          type="button">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body">
        <div class="row">
          {#if serverListLoading}
            <div class="spinner-border text-primary mr-2" role="status"></div>
          {/if}

          <!-- Server Card -->
          {#if !serverListLoading && $servers.length > 0}
            {#each $servers as server}
              <div class="col-lg-4 col-md-6">
                <!--            :class="{ 'selected': selected_server.id === server.id }"-->
                <div class="card w-100">
                  <!--              @click="selectServer(server)"-->
                  <a href="javascript:void(0);">
                    <div class="card-img-top bg-primary border-0">
                      <div class="card-body">
                        <h4 class="card-title text-white lead">
                          <Icon data="{faHome}" class="mr-1 text-light" />
                          {server.name} Panocraft
                        </h4>
                        <h5 class="badge badge-sunflower">Spigot</h5>
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
                          bg-white p-1 text-center" />
                      </div>
                      <div
                        class="mt-4 card-body text-center text-dark d-flex
                        flex-row justify-content-between">
                        <div>
                          <span class="lead">
                            {server.status === "online"
                              ? server.player_count
                              : 0}
                            / {server.max_player_count}
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
                        type="button">
                        <Icon data="{faCog}" class="mr-1" />
                      </button>
                      <div
                        aria-labelledby="serverOptions"
                        class="dropdown-menu">
                        <a
                          class="dropdown-item"
                          href="javascript:void(0);"
                          v-if="main_server.id !== server.id">
                          <Icon data="{faHome}" class="mr-1 text-primary" />
                          Ana Sunucu Olarak Belirle
                        </a>

                        <a
                          class="dropdown-item"
                          href="javascript:void(0);"
                          v-if="main_server.id === server.id">
                          <Icon data="{faTimes}" class="mr-1 text-primary" />
                          Ana Sunuculuğunu Kaldır
                        </a>
                        <!--                    @click="onRemoveClick(server)"-->
                        <a
                          class="dropdown-item"
                          data-dismiss="modal"
                          data-target="#confirmRemoveServer"
                          data-toggle="modal"
                          href="javascript:void(0);">
                          <Icon data="{faTimes}" class="mr-1 text-danger" />
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
            <div class="container text-center">
              <Icon data="{faCube}" scale="4" class="m-3 text-glass" />
              <p class="text-gray">Bağlı sunucu yok.</p>
            </div>
          {/if}
        </div>
      </div>
    </div>
  </div>
</div>
