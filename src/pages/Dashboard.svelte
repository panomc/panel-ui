<script>
  import { isPageInitialized } from "../Store";

  import Icon from "svelte-awesome";
  import {
    faBell,
    faDotCircle,
    faUser,
    faStickyNote,
  } from "@fortawesome/free-regular-svg-icons";
  import {
    faPlus,
    faPen,
    faBrush,
    faTools,
    faUserCog,
    faPuzzlePiece,
    faPalette,
    faBookOpen,
    faCaretUp,
    faCaretDown,
    faLiraSign,
    faTicketAlt,
    faGlobe,
  } from "@fortawesome/free-solid-svg-icons";
  import { faDiscord } from "@fortawesome/free-brands-svg-icons";

  import ApiUtil from "../pano/js/api.util";
  import { showNetworkErrorOnCatch } from "../Store";

  import VisitorsChart from "../components/charts/Dashboard/VisitorsChart.svelte";
  import PlayersChart from "../components/charts/Dashboard/PlayersChart.svelte";
  import TicketsChart from "../components/charts/Dashboard/TicketsChart.svelte";
  import PostsChart from "../components/charts/Dashboard/PostsChart.svelte";

  let getting_started_blocks = {
    welcome_board: false,
  };

  let registered_player_count = 0;
  let post_count = 0;
  let tickets_count = 0;
  let open_tickets_count = 0;

  function getInitialData() {
    showNetworkErrorOnCatch((resolve, reject) => {
      ApiUtil.get("panel/initPage/dashboard")
        .then((response) => {
          if (response.data.result === "ok") {
            registered_player_count = response.data.registered_player_count;
            post_count = response.data.post_count;
            tickets_count = response.data.tickets_count;
            open_tickets_count = response.data.open_tickets_count;

            getting_started_blocks = response.data.getting_started_blocks;

            isPageInitialized.set(true);

            resolve();
          } else reject();
        })
        .catch(() => {
          reject();
        });
    });
  }

  function onCloseGettingStartedCard() {
    showNetworkErrorOnCatch((resolve, reject) => {
      ApiUtil.post("panel/dashboard/closeGettingStartedCard", {})
        .then(() => {
          resolve();
        })
        .catch(() => {
          reject();
        });
    });
  }

  getInitialData();
</script>

<!-- Dashboard Page -->
<div class="content">
  <!-- Welcome Alerts -->
  {#if getting_started_blocks.welcome_board}
    <div
      class="alert card rounded alert-welcome alert-dismissible flex-fill w-100
      show border mb-4"
      role="alert"
    >
      <button
        class="close"
        data-dismiss="alert"
        type="button"
        on:click="{onCloseGettingStartedCard}"
      >
        <span aria-hidden="true">&times;</span>
      </button>
      <div class="card-body">
        <div class="row">
          <div class="col-12">
            <h4 class="card-title text-primary">Hoş Geldiniz</h4>
            <p>
              Pano kullanıma hazır! İşte başlarken yapabileceklerinizden
              bazıları:
            </p>
          </div>
          <div class="col-lg-4 mb-lg-0 mb-3">
            <h5>Sunucu Bağlayın</h5>
            <p>
              Oyun sunucunuzu platforma bağlayın ve sunucu bilgilerine panel
              üzerinden erişin.
            </p>
            <button
              class="btn btn-sm btn-outline-primary"
              data-target="#connectServer"
              data-toggle="modal"
            >
              <Icon data="{faPlus}" class="mr-2" />
              Sunucu Bağla
            </button>
          </div>
          <div class="col-lg-4 mb-lg-0 mb-3">
            <ul class="list-unstyled mb-1">
              <h5>Başlarken</h5>
              <li>
                <a href="panel/posts/create-post">
                  <Icon data="{faPen}" class="mr-1" />
                  İlk Yazınızı Yayınlayın
                </a>
              </li>
              <li>
                <a href="panel/view">
                  <Icon data="{faBrush}" class="mr-1" />
                  Sitenizin Görünümünü Belirleyin
                </a>
              </li>
              <li>
                <a href="panel/tools">
                  <Icon data="{faTools}" class="mr-1" />
                  Araçları Yönetin
                </a>
              </li>
              <li>
                <a href="panel/players">
                  <Icon data="{faUserCog}" class="mr-1" />
                  Oyuncularınızı İnceleyin
                </a>
              </li>
            </ul>
          </div>
          <div class="col-lg-4 mb-lg-0 mb-3">
            <ul class="list-unstyled mb-1">
              <h5>Daha Fazlası</h5>
              <li>
                <a href="javascript:void(0);">
                  <Icon data="{faPuzzlePiece}" class="mr-1" />
                  Eklenti Ekleyin
                </a>
              </li>
              <li>
                <a href="javascript:void(0);">
                  <Icon data="{faPalette}" class="mr-1" />
                  Tema Ekleyin
                </a>
              </li>
              <li>
                <a href="javascript:void(0);" target="_blank">
                  <Icon data="{faBookOpen}" class="mr-1" />
                  Dökümantasyonları İnceleyin
                </a>
              </li>
              <li>
                <a href="https://panomc.com/discord" target="_blank">
                  <Icon data="{faDiscord}" class="mr-1" />
                  Discord Topluluğumuza Katılın
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  {/if}
  <!-- Dashboard Title  -->
  <h3 class="text-muted badge badge-lightprimary panel-subtitle">Website</h3>

  <div class="row">

    <div class="col-lg-3 col-sm-6">
      <div class="card">
        <div class="p-3">
          <div class="row align-items-center">
            <div class="col-6">
              <h3 class="font-weight-bolder text-primary">
                {registered_player_count}
                <Icon data="{faCaretUp}" class="ml-2" />
              </h3>
              <span class="text-primary">Yeni Kayıt</span>
            </div>
            <div class="col-6">
              <PlayersChart />
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="col-lg-3 col-sm-6">
      <div class="card">
        <div class="p-3">
          <div class="row align-items-center">
            <div class="col">
              <h3 class="font-weight-bolder text-secondary">1</h3>
              <span class="text-secondary">Oturumu Açık</span>
            </div>
            <div class="col-auto">
              <Icon data="{faGlobe}" class="text-gray d-block mx-2" />
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="col-lg-3 col-sm-6">
      <div class="card">
        <div class="p-3">
          <div class="row align-items-center">
            <div class="col">
              <h3 class="font-weight-bolder text-bittersweet">1</h3>
              <span class="text-bittersweet">Yazı Görüntülemesi</span>
            </div>
            <div class="col-auto">
              <Icon data="{faStickyNote}" class="text-gray d-block mx-2" />
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="col-lg-3 col-sm-6">
      <div class="card"></div>
    </div>
    <div class="row">
      <div class="col-lg-8">
        <div class="d-flex flex-fill card">
          <div class="card-body h-100">
            <div class="row justify-content-between">
              <div class="col-4">
                <h5 class="card-title">Ziyaretler</h5>
              </div>
              <div class="col-8 text-right">
                <div class="btn-group">
                  <button class="btn btn-sm btn-outline-light btn-link active">
                    Haftalık
                  </button>
                  <button class="btn btn-sm btn-outline-light btn-link">
                    Aylık
                  </button>
                </div>
              </div>
            </div>
            <div class="d-flex align-items-center h-100">
              <VisitorsChart />
            </div>
          </div>
        </div>
      </div>
      <div class="col-lg-4">
        <div class="card">
          <div class="card-body">
            <div class="row justify-content-between">
              <div class="col-4">
                <h5 class="card-title">Trafik</h5>
              </div>
              <div class="col-8 text-right">
                <div class="btn-group">
                  <button class="btn btn-sm btn-outline-light btn-link active">
                    Haftalık
                  </button>
                  <button class="btn btn-sm btn-outline-light btn-link">
                    Aylık
                  </button>
                </div>
              </div>
            </div>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Excepturi,
            quam cum qui recusandae sed officiis sit cumque illo accusantium
            tempora ex repellat laborum similique, quas, officia doloribus quod
            non distinctio. Lorem ipsum dolor sit amet consectetur adipisicing
            elit. Incidunt accusantium eveniet necessitatibus. Repudiandae
            voluptatem soluta saepe architecto, earum nostrum in mollitia quam
            possimus facere molestias nobis, recusandae beatae quod alias.
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Latest Tickets -->
  <div class="card">
    <div class="card-body">
      <div class="row justify-content-between">
        <div class="col-6">
          <h5 class="card-title">Son Talepler</h5>
        </div>
        <div class="col-6 text-right">
          <a href="/tickets" class="btn btn-link bg-light btn-sm">
            Tüm Talepler
          </a>
        </div>
      </div>

      <ul class="list-group">

        <a
          href="javascript:void(0);"
          class="list-group-item list-group-item-action rounded d-flex flex-row"
        >
          <div class="col-auto">
            <img
              src="https://minotar.net/avatar/e5eea5f735c444a28af9b2c867ade454/64"
              width="48"
              height="48"
              class="border rounded-circle"
              alt="Butlu"
            />
          </div>
          <div class="col">
            <span class="text-primary">
              Lagdan öldüm itemlerim gitti, lütfen ilgilenebilir misiniz?
            </span>
            <br />
            <small class="text-muted">
              <b>2 gün önce</b>
              ,
              <b>Genel</b>
              kategorisine açıldı.
            </small>
          </div>
          <div class="col-auto d-flex align-items-center">
            <span class="badge badge-secondary badge-pill">Yeni</span>
          </div>
        </a>
      </ul>

    </div>
  </div>

  <!-- Statistic Table -->
  <div class="card">
    <div class="card-body">
      <h5 class="card-title">İstatistik</h5>
      <div class="table-responsive">
        <table class="table table-sm m-0">
          <tbody class="text-muted">
            <tr>
              <th scope="row">Yazılar:</th>
              <td>{post_count}</td>
            </tr>
            <tr>
              <th scope="row">Sayfalar:</th>
              <td>0</td>
            </tr>
            <tr>
              <th scope="row">Oyuncular:</th>
              <td>{registered_player_count}</td>
            </tr>
            <tr>
              <th scope="row">Yöneticiler:</th>
              <td>?</td>
            </tr>
            <tr>
              <th scope="row">Talepler:</th>
              <td>{tickets_count}</td>
            </tr>
            <tr>
              <th scope="row">Bağlı Sunucular:</th>
              <td>?</td>
            </tr>
            <tr>
              <th scope="row">Eklentiler:</th>
              <td>?</td>
            </tr>
            <tr>
              <th scope="row">Temalar:</th>
              <td>?</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</div>
