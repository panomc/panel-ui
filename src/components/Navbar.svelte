<script>
  import Icon from "svelte-awesome";
  import {
    faBell,
    faDotCircle,
    faUser
  } from "@fortawesome/free-regular-svg-icons";
  import {
    faBars,
    faStore,
    faUserCog,
    faUserPlus,
    faSignOutAlt
  } from "@fortawesome/free-solid-svg-icons";
</script>

<!-- Top Navbar -->
<nav
  class="navbar navbar-expand navbar-light bg-white sticky-top border-bottom">
  <ul class="nav navbar-nav mr-auto">
    <li class="nav-item mr-3">
      <!--        @click="onSideBarCollapseClick"-->
      <a
        class="icon-link nav-link"
        href="javascript:void(0);"
        title="Menüyü Aç/Kapa">
        <Icon data={faBars} />
      </a>
    </li>
    <li class="nav-item">
      <a
        href="javascript:void(0);"
        target="_blank"
        class="btn btn-link border-lightprimary text-secondary">
        <Icon data={faStore} class="d-lg-none d-inline" />
        <span class="d-lg-inline d-none">Web Market</span>
      </a>
    </li>
  </ul>
  <div class="navbar-brand">
    <span class="font-weight-normal">Panel</span>
  </div>

  <ul class="nav navbar-nav ml-auto">
    <li class="nav-item dropdown">
      <a
        class="icon-link nav-link position-relative"
        data-toggle="dropdown"
        href="javascript:void(0);"
        role="button"
        title="Bildirimler">
        <div class="notification" v-if="notificationsCount != 0" />
        <Icon data={faBell} />
      </a>
      <div
        class="dropdown-menu animated fadeIn faster dropdown-menu-right
        notifications">
        <h6 class="dropdown-header">
          Bildirimler
          <!--          ({{ notificationsCount }})-->
          <a
            class="float-right"
            href="javascript:void(0);"
            title="Tümünü Oku"
            v-if="quickNotifications.length != 0">
            Tümünü Oku
          </a>
        </h6>

        <router-link
          class="dropdown-item d-flex w-100 justify-content-between
          border-bottom py-3 bg-lightprimary"
          to="javascript:void(0);"
          :key="index"
          v-for="(notification, index) in quickNotifications">
          <h6 class="text-muted m-0 text-wrap d-inline">
            <Icon data={faDotCircle} class="text-primary" />
            <span v-text="notification.type_ID" />
          </h6>
          <small class="text-muted text-right font-weight-lighter">15 dk</small>
        </router-link>

        <div
          class="d-flex flex-column align-items-center justify-content-center"
          v-if="quickNotifications.length === 0">
          <Icon data={faBell} scale="3" class="text-glass m-3" />
          <p class="text-gray">Yeni bildirim yok.</p>
        </div>

        <router-link
          class="dropdown-item text-primary text-center small pt-2"
          to="/panel/notifications">
          Bildirim Geçmişini Görüntüle
        </router-link>
      </div>
    </li>

    <li class="nav-item dropdown">
      <a
        aria-expanded="false"
        aria-haspopup="true"
        class="icon-link nav-link text-capitalize"
        data-toggle="dropdown"
        href="javascript:void(0);"
        title="Oturum">
        <Icon data={faUser} />
        <span class="d-lg-inline d-none">
          <!--            {{ username }}-->
        </span>
      </a>
      <div class="dropdown-menu dropdown-menu-right animated fadeIn faster">
        <ul class="nav flex-column">
          <li class="nav-item">
            <a class="nav-link" href="javascript:void(0);">
              <Icon data={faUserCog} class="mr-1" />
              Hesabı Yönet
            </a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="javascript:void(0);">
              <Icon data={faUserPlus} class="mr-1" />
              Yönetici Ekle
            </a>
          </li>
          <li class="nav-item">
            <a class="nav-link text-danger" href="javascript:void(0);">
              <Icon data={faSignOutAlt} class="mr-1" />
              Çıkış Yap
            </a>
          </li>
        </ul>
      </div>
    </li>
  </ul>
</nav>
