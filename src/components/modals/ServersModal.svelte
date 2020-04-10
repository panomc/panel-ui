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
          <i aria-hidden="true" class="fa fa-plus fa-fw" />
          Suncuu Bağla
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

          <div
            class="spinner-border text-primary"
            role="status"
            v-if="serverListLoading" />

          <!-- Server Card -->
          <div
            :key="index"
            class="col-lg-4 col-md-6"
            v-for="(server, index) in servers"
            v-if="!serverListLoading && servers.length > 0">
            <!--            :class="{ 'selected': selected_server.id === server.id }"-->
            <div class="card w-100">
              <!--              @click="selectServer(server)"-->
              <a href="javascript:void(0);">
                <div
                  class="card-img-top bg-primary border-0"
                  style="height: 100px;">
                  <div class="card-body">
                    <h4 class="card-title text-white lead">
                      <i
                        aria-hidden="true"
                        class="fa fa-home fa-fw text-primary fa-xs"
                        v-if="main_server.id === server.id" />
                      <!--                        {{ server.name }}-->
                    </h4>
                    <h5 class="badge badge-sunflower">Spigot</h5>
                  </div>
                </div>
                <div class="position-relative">
                  <div class="position-absolute w-100" style="top: -60px;">
                    <img
                      :src="server.favicon"
                      alt=" Sever İkon"
                      class="d-block m-auto border rounded-circle shadow-sm
                      bg-white p-1 text-center" />
                  </div>
                  <div
                    class="mt-4 card-body text-center text-dark d-flex flex-row
                    justify-content-between">
                    <div>
                      <span class="lead">
                        <!--                          {{ server.status === 'online' ? server.player_count : 0 }}-->
                        /
                        <!--                          {{ server.max_player_count }}-->
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
                    <i aria-hidden="true" class="fa fa-cog fa-fw" />
                  </button>
                  <div aria-labelledby="serverOptions" class="dropdown-menu">

                    <a
                      class="dropdown-item"
                      href="javascript:void(0);"
                      v-if="main_server.id !== server.id">
                      <i
                        aria-hidden="true"
                        class="fa fa-home fa-fw text-primary" />
                      Ana Sunucu Olarak Belirle
                    </a>

                    <a
                      class="dropdown-item"
                      href="javascript:void(0);"
                      v-if="main_server.id === server.id">
                      <i
                        aria-hidden="true"
                        class="fa fa-times fa-fw text-primary" />
                      Ana Sunuculuğunu Kaldır
                    </a>
                    <!--                    @click="onRemoveClick(server)"-->
                    <a
                      class="dropdown-item"
                      data-dismiss="modal"
                      data-target="#confirmRemoveServer"
                      data-toggle="modal"
                      href="javascript:void(0);">
                      <i
                        aria-hidden="true"
                        class="fa fa-times fa-fw text-danger" />
                      Sunucuyu Kaldır
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- No Server -->
          <div class="container text-center" v-if="servers.length === 0">
            <i aria-hidden="true" class="fas fa-cube fa-4x text-glass m-3" />
            <p class="text-gray">Bağlı sunucu yok.</p>
          </div>

        </div>
      </div>
    </div>
  </div>
</div>
