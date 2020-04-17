<script>
  import { isPageInitialized } from "../Store";

  import Icon from "svelte-awesome";
  import {
    faBell,
    faDotCircle,
    faUser
  } from "@fortawesome/free-regular-svg-icons";
  import {
    faPlus,
    faPen,
    faBrush,
    faTools,
    faUserCog,
    faPuzzlePiece,
    faPalette,
    faBookOpen
  } from "@fortawesome/free-solid-svg-icons";
  import { faDiscord } from "@fortawesome/free-brands-svg-icons";

  isPageInitialized.set(true);
</script>

<!-- Dashboard Page -->
<div class="content">
  <!-- Welcome Alerts -->
  <div
    class="alert card rounded alert-welcome alert-dismissible flex-fill w-100
    show border mb-4"
    role="alert">
    <!-- v-if="getting_started_blocks.welcome_board" -->
    <!-- @click="onCloseGettingStartedCard" -->
    <button class="close" data-dismiss="alert" type="button">
      <span aria-hidden="true">&times;</span>
    </button>
    <div class="card-body">
      <div class="row">
        <div class="col-12">
          <h4 class="card-title text-primary">Hoş Geldiniz</h4>
          <p>
            Pano kullanıma hazır! İşte başlarken yapabileceklerinizden bazıları:
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
            data-toggle="modal">
            <Icon data={faPlus} class="mr-2" />
            Sunucu Bağla
          </button>
        </div>
        <div class="col-lg-4 mb-lg-0 mb-3">
          <ul class="list-unstyled mb-1">
            <h5>Başlarken</h5>
            <li>
              <a href="panel/posts/create-post">
                <Icon data={faPen} class="mr-1" />
                İlk Yazınızı Yayınlayın
              </a>
            </li>
            <li>
              <a href="panel/view">
                <Icon data={faBrush} class="mr-1" />
                Sitenizin Görünümünü Belirleyin
              </a>
            </li>
            <li>
              <a href="panel/tools">
                <Icon data={faTools} class="mr-1" />
                Araçları Yönetin
              </a>
            </li>
            <li>
              <a href="panel/players">
                <Icon data={faUserCog} class="mr-1" />
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
                <Icon data={faPuzzlePiece} class="mr-1" />
                Eklenti Ekleyin
              </a>
            </li>
            <li>
              <a href="javascript:void(0);">
                <Icon data={faPalette} class="mr-1" />
                Tema Ekleyin
              </a>
            </li>
            <li>
              <a href="javascript:void(0);">
                <Icon data={faBookOpen} class="mr-1" />
                Dökümantasyonları İnceleyin
              </a>
            </li>
            <li>
              <a href="https://panomc.com/discord" target="_blank">
                <Icon data={faDiscord} class="mr-1" />
                Discord Topluluğumuza Katılın
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>

  <!-- Dashboard Title  -->
  <h3 class="text-muted badge badge-lightprimary panel-subtitle">Website</h3>

  <!-- Website Activity -->
  <div class="row justify-content-around align-items-stretch">

    <!-- Statics Blocks -->
    <div class="d-flex col-lg-9">
      <div class="d-flex flex-fill card">
        <div class="card-body h-100">
          <div class="row justify-content-between">
            <div class="col-4">
              <h5 class="card-title b-0">Ziyaretler</h5>
            </div>
            <div class="col-8 text-right">
              <div class="btn-group">
                <button class="btn btn-sm btn-outline-primary active">
                  Haftalık
                </button>
                <button class="btn btn-sm btn-outline-primary">Aylık</button>
              </div>
            </div>
          </div>
          <div class="d-flex align-items-center h-100">
            <canvas height="120" id="myChart" />
          </div>
        </div>
      </div>
    </div>

    <div class="d-flex flex-fill col-lg-3">
      <div
        class="d-flex flex-column justify-content-between justify-items-stretch
        w-100 h-100">
        <div class="card d-flex flex-fill">
          <div class="card-body pt-3 pb-0 d-flex flex-row align-items-center">
            <h2 class="text-secondary font-weight-bolder m-0">
              <!-- {{ registered_player_count }} -->
            </h2>
            <strong class="pl-4">Oyuncu</strong>
          </div>
          <canvas height="90" id="playersChart" />
        </div>
        <div class="card d-flex flex-fill">
          <div class="card-body pt-3 pb-0 d-flex flex-row align-items-center">
            <h2 class="text-bittersweet font-weight-bolder m-0">
              <!-- {{ registered_player_count }} -->
            </h2>
            <strong class="pl-4">Talepler</strong>
          </div>
          <canvas height="90" id="ticketsChart" />
        </div>
        <div class="card d-flex flex-fill">
          <div class="card-body pt-3 pb-0 d-flex flex-row align-items-center">
            <h2 class="text-sunflower font-weight-bolder m-0">
              <!-- {{ post_count }} -->
            </h2>
            <strong class="pl-4">Yazılar</strong>
          </div>
          <canvas height="90" id="postsChart" />
        </div>
      </div>
    </div>
  </div>

  <!-- Latest Tickets & Event Calender -->
  <div class="row justify-content-around">
    <div class="col-lg-6">
      <div class="card">
        <div class="card-body">
          <h5 class="card-title">Son Talepler</h5>
          <div>
            <router-link to="/" title="Butlu">
              <img
                class="img-fluid mr-3 rounded border float-left"
                src="https://minotar.net/avatar/e5eea5f735c444a28af9b2c867ade454/64"
                width="46"
                alt="Username" />
            </router-link>
            <strong>
              <a href="javascript:void(0);" class="text-primary">#4513</a>
              Bu bir talep konusu
            </strong>
            <br />
            <small class="text-muted">
              <a href="javascript:void(0);">Butlu</a>
              tarafından
              <a href="javascript:void(0);">Genel</a>
              kategorisine açıldı.
            </small>
          </div>
          <hr />
          <div>
            <router-link to="/" title="Butlu">
              <img
                class="img-fluid mr-3 rounded border float-left"
                src="https://minotar.net/avatar/e5eea5f735c444a28af9b2c867ade454/64"
                width="46"
                alt="Username" />
            </router-link>
            <strong>
              <a href="javascript:void(0);" class="text-primary">#4513</a>
              Bu bir talep konusu
            </strong>
            <br />
            <small class="text-muted">
              <a href="javascript:void(0);">Butlu</a>
              tarafından
              <a href="javascript:void(0);">Genel</a>
              kategorisine açıldı.
            </small>
          </div>
        </div>
      </div>
    </div>

    <div class="col-lg-6 d-flex">
      <div class="card d-flex flex-fill">
        <div class="card-body">
          <h5 class="card-title">Etkinlik Takvimi</h5>
        </div>
      </div>
    </div>
  </div>

  <!-- Statistic Table -->
  <div class="card">
    <div class="card-body">
      <h5 class="card-title">Tüm İstatistikler</h5>
      <div class="table-responsive">
        <table class="table table-sm m-0">
          <thead>
            <tr class="text-primary">
              <th scope="col">İstatistik</th>
              <th scope="col">Veri</th>
            </tr>
          </thead>
          <tbody class="text-muted">
            <tr>
              <th scope="row">Yazılar:</th>
              <td>0</td>
            </tr>
            <tr>
              <th scope="row">Sayfalar:</th>
              <td>0</td>
            </tr>
            <tr>
              <th scope="row">Kayıtlı Oyuncular:</th>
              <td v-text="registered_player_count" />
            </tr>
            <tr>
              <th scope="row">Açık Talepler:</th>
              <td>0</td>
            </tr>
            <tr>
              <th scope="row">Kayıtlı Talepler:</th>
              <td>0</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</div>
