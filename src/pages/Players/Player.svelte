<script>
  import { isPageInitialized } from "../../Store";
  import { getPath, route } from "routve";
  import ConfirmBanPlayerModal from "../../components/modals/ConfirmBanPlayerModal.svelte";

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
      <a class="btn btn-link" role="button" href="/panel/players">
        <Icon data="{faArrowLeft}" class="mr-1" />
        Oyuncular
      </a>
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
            data-target="#conformBanPlayer"
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
            class="mb-3 rounded-circle player-profile-icon border-lightsecondary"
            width="80"
            height="80"
            src="https://minotar.net/avatar/butlu"
          />

          <h4 class="card-title"><span><del>Butlu</del></span></h4>
          <div class="badge badge-pill badge-danger d-block">Yasaklı</div>

          <hr />

          <ul class="list-inline my-0">
            <li class="list-inline-item">
              <div class="badge text-dark border">Yönetici</div>
            </li>
            <li class="list-inline-item">
              <div class="badge text-dark border">Kayıt: 01.01.2019</div>
            </li>
          </ul>
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
          -
        </div>
      </div>
    </div>
  </div>
</div>
<!-- Ban Player Confirmation Modal -->

<ConfirmBanPlayerModal />
