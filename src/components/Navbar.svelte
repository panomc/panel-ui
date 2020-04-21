<script>
  import { ApiUtil } from "../util/api.util";
  import {
    toggleSidebar,
    notificationsCount,
    quickNotifications,
    user,
    logoutLoading,
    showNetworkErrorOnCatch
  } from "../Store";

  import Icon from "svelte-awesome";
  import {
    faBell,
    faDotCircle,
    faUser
  } from "@fortawesome/free-regular-svg-icons";
  import {
    faBars,
    faStore,
    faCog,
    faUserPlus,
    faSignOutAlt
  } from "@fortawesome/free-solid-svg-icons";

  function onSideBarCollapseClick() {
    toggleSidebar();
  }

  function onLogout() {
    logoutLoading.set(true);

    showNetworkErrorOnCatch(
      () =>
        new Promise((resolve, reject) => {
          ApiUtil.post("auth/logout", {})
            .then(() => {
              window.location.href = "/";

              resolve();
            })
            .catch(() => {
              reject();
            });
        })
    );
  }
</script>

<!-- Top Navbar -->
<nav
  class="navbar navbar-expand navbar-light bg-white sticky-top border-bottom">
  <ul class="nav navbar-nav mr-auto">
    <li class="nav-item mr-2">
      <a
        class="icon-link nav-link"
        href="javascript:void(0);"
        title="Menüyü Aç/Kapa"
        on:click={onSideBarCollapseClick}>
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

  <div class="navbar-brand">Panel</div>

  <ul class="nav navbar-nav ml-auto">
    <li class="nav-item dropdown">
      <a
        class="icon-link nav-link position-relative"
        data-toggle="dropdown"
        href="javascript:void(0);"
        role="button"
        title="Bildirimler">
        {#if $notificationsCount !== 0}
          <div class="notification" />
        {/if}
        <Icon data={faBell} />
      </a>
      <div
        class="dropdown-menu animated fadeIn faster dropdown-menu-right
        notifications">
        <h6 class="dropdown-header">Bildirimler</h6>

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

        {#if $quickNotifications.length === 0}
          <div
            class="d-flex flex-column align-items-center justify-content-center">
            <Icon data={faBell} scale="3" class="text-glass m-3" />
            <p class="text-gray">Bildirim yok.</p>
          </div>
        {/if}

        <!-- Loading Spinner -->
        <div class="d-flex justify-content-center m-3">
          <div
            class="spinner-border spinner-border-sm text-primary"
            role="status" />
        </div>

        <router-link
          class="dropdown-item text-primary text-center small pt-2
          font-weight-bolder"
          to="/panel/notifications">
          Tümünü Görüntüle — 5
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
      </a>
      <div class="dropdown-menu dropdown-menu-right animated fadeIn faster">
        <ul class="nav flex-column">
          <li class="nav-item">
            <a class="nav-link text-primary" href="javascript:void(0);">
              <Icon data={faUser} class="mr-1" />
              {$user.username}
            </a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="javascript:void(0);">
              <Icon data={faUserPlus} class="mr-1" />
              Yönetici Ekle
            </a>
          </li>
          <li class="nav-item">
            <a
              class="nav-link text-danger"
              href="javascript:void(0);"
              on:click={onLogout}>
              <Icon data={faSignOutAlt} class="mr-1" />
              Çıkış Yap
            </a>
          </li>
        </ul>
      </div>
    </li>
  </ul>
</nav>
