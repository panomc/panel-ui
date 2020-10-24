<script>
  import { isPageInitialized } from "../../Store";
  import { getPath, route } from "routve";

  import Icon from "svelte-awesome";
  import ApiUtil from "../../pano/js/api.util";
  import {
    faArrowLeft,
    faTimes,
    faCheck,
    faGlobe,
    faUserCircle,
    faEllipsisV,
  } from "@fortawesome/free-solid-svg-icons";

  isPageInitialized.set(true);
</script>

<!-- Player Detail Page -->

<div class="content">
  <!-- Action Menu -->
  <div class="row mb-3">
    <div class="col-md-4 col-6">
      <router-link class="btn btn-link" role="button" to="/panel/players">
        <Icon data="{faArrowLeft}" class="mr-1" />
        Oyuncular
      </router-link>
    </div>
    <div class="col text-right">
      <div class="dropdown">
        <a
          class="btn btn-link"
          aria-expanded="false"
          aria-haspopup="true"
          data-toggle="dropdown"
          href="javascript:void(0);"
          id="playerAction"
          title="Eylemler"
        >
          <Icon data="{faEllipsisV}" />
        </a>
        <div
          aria-labelledby="playerAction"
          class="dropdown-menu dropdown-menu-right"
        >
          <a class="dropdown-item" href="javascript:void(0);">
            <Icon data="{faUserCircle}" class="mr-1 text-primary" />
            Yetkilendir
          </a>
          <a
            class="dropdown-item"
            data-target="#conformBanTickets"
            data-toggle="modal"
            href="javascript:void(0);"
          >
            <Icon data="{faTimes}" class="mr-1 text-danger" />
            Yasakla
          </a>
        </div>
      </div>
    </div>
  </div>

  <div class="row">
    <div class="col-lg-3">
      <div class="card">
        <div
          class="card-body d-flex flex-column justify-content-center
          align-items-center"
        >
          <img
            alt="Username"
            class="mb-3 rounded-circle"
            width="64"
            height="64"
            src="https://minotar.net/avatar/butlu"
          />
          <h4 class="card-title">
            <span class="badge badge-danger badge-pill mr-2">Yasaklı</span>
            Butlu
          </h4>

          Kayıt: 01.01.2019

          <hr />

          <span
            class="badge badge-pill badge-lightsecondary text-success"
            v-tooltip:top="'Sitede'"
          >
            <i aria-hidden="true" class="fa fa-globe fa-fw"></i>
            <Icon data="{faGlobe}" />
            <span class="d-md-inline d-none ml-1">Çevrimiçi</span>
          </span>
        </div>
      </div>
    </div>
    <div class="col-lg-9">
      <!-- User's Tickets -->
      <div class="card">
        <div class="card-body">
          <div class="row justify-content-between">
            <div class="col-6">
              <h5 class="card-title">Butlu tarafından Son Talepler</h5>
            </div>
            <div class="col-6 text-right">
              <a href="/panel/tickets" class="btn btn-link bg-light btn-sm">
                Tüm Talepler
              </a>
            </div>
          </div>

          Buraya kullaınıcının son talepleri (istatistiklerdeki gibi)
        </div>
      </div>

      <!-- User's Tickets -->
    </div>
  </div>

  <!-- Confirm Ban User Tickets Modal -->
  <div
    aria-hidden="true"
    class="modal fade"
    id="conformBanTickets"
    role="dialog"
    tabindex="-1"
  >
    <div class="modal-dialog modal-dialog-centered" role="dialog">
      <div class="modal-content">
        <div class="modal-body text-center">
          <div class="pb-3">
            <i
              aria-hidden="true"
              class="fa fa-question-circle fa-4x d-block m-auto text-gray"
            ></i>
          </div>
          <span>
            Bu kullanıcının taleplerini gerçekten yasaklamak istiyor musunuz?
          </span>
        </div>
        <div class="modal-footer">
          <button
            class="btn btn-outline-primary w-100"
            data-dismiss="modal"
            type="button"
          >
            Hayır
          </button>
          <button class="btn btn-danger w-100" type="button">Evet</button>
        </div>
      </div>
    </div>
  </div>
</div>
