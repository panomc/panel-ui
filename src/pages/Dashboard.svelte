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
</div>
