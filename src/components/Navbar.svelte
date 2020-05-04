<script>
  import jQuery from "jquery";
  import { onMount } from "svelte";
  import moment from "moment";

  import { ApiUtil } from "../util/api.util";
  import {
    toggleSidebar,
    notificationsCount,
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

  let notificationsLoading = true;
  let quickNotifications = [];
  let quickNotificationProcessID = 0;

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

  function array_move(arr, old_index, new_index) {
    if (new_index >= arr.length) {
      let k = new_index - arr.length + 1;
      while (k--) {
        arr.push(undefined);
      }
    }
    arr.splice(new_index, 0, arr.splice(old_index, 1)[0]);
    return arr; // for testing
  }

  function setNotifications(newNotifications) {
    if (quickNotifications.length === 0 || newNotifications.length === 0) {
      quickNotifications = newNotifications;
    } else {
      quickNotifications.forEach((item, index) => {
        const newArrayOfFilter = newNotifications.filter(
          filterItem => filterItem.id === item.id
        );

        if (newArrayOfFilter.length === 0) {
          quickNotifications = quickNotifications.splice(index - 1, 1);
        }
      });

      newNotifications.forEach((item, index) => {
        const newArrayOfFilter = quickNotifications.filter(
          filterItem => filterItem.id === item.id
        );

        if (newArrayOfFilter.length === 0) {
          quickNotifications[index] = item;
        }
      });

      newNotifications.forEach((item, index) => {
        const newArrayOfFilter = quickNotifications.filter(
          filterItem => filterItem.id === item.id
        );

        if (newArrayOfFilter.length !== 0) {
          quickNotifications = array_move(
            quickNotifications,
            index,
            quickNotifications.indexOf(newArrayOfFilter[0])
          );
        }
      });
    }
  }

  function getQuickNotificationsAndRead(id) {
    showNetworkErrorOnCatch(
      () =>
        new Promise((resolve, reject) => {
          ApiUtil.get("panel/quickNotificationsAndRead")
            .then(response => {
              if (quickNotificationProcessID === id) {
                if (response.data.result === "ok") {
                  setNotifications(response.data.notifications);
                  notificationsCount.set(response.data.notifications_count);

                  notificationsLoading = false;
                }

                setTimeout(() => {
                  if (quickNotificationProcessID === id) {
                    startQuickNotificationsAndReadCountDown();
                  }
                }, 1000);
              }

              resolve();
            })
            .catch(() => {
              reject();
            });
        })
    );
  }

  function getQuickNotifications(id) {
    showNetworkErrorOnCatch(
      () =>
        new Promise((resolve, reject) => {
          ApiUtil.get("panel/quickNotifications")
            .then(response => {
              if (quickNotificationProcessID === id) {
                if (response.data.result === "ok") {
                  notificationsCount.set(response.data.notifications_count);
                }

                setTimeout(() => {
                  if (quickNotificationProcessID === id) {
                    startQuickNotificationsCountDown();
                  }
                }, 1000);
              }

              resolve();
            })
            .catch(() => {
              reject();
            });
        })
    );
  }

  function startQuickNotificationsAndReadCountDown() {
    quickNotificationProcessID++;

    const id = quickNotificationProcessID;

    getQuickNotificationsAndRead(id);
  }

  function startQuickNotificationsCountDown() {
    quickNotificationProcessID++;

    const id = quickNotificationProcessID;

    getQuickNotifications(id);
  }

  startQuickNotificationsCountDown();

  onMount(() => {
    jQuery("#quickNotificationsDropdown")
      .on("show.bs.dropdown", function() {
        notificationsLoading = true;
        quickNotifications = [];

        startQuickNotificationsAndReadCountDown();
      })
      .on("hide.bs.dropdown", function() {
        startQuickNotificationsCountDown();
      });
  });
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

  <!-- Notifications Dropdown -->

  <ul class="nav navbar-nav ml-auto">
    <li class="nav-item dropdown" id="quickNotificationsDropdown">
      <a
        class="icon-link nav-link position-relative"
        data-toggle="dropdown"
        href="javascript:void(0);"
        role="button"
        title="Bildirimler">
        {#if $notificationsCount !== 0}
          <div class="unread-badge" />
        {/if}
        <Icon data={faBell} />
      </a>

      <div
        class="dropdown-menu animated fadeIn faster dropdown-menu-right
        notifications">
        <h6 class="dropdown-header">Bildirimler</h6>

        {#if !notificationsLoading}
          {#each quickNotifications as notification}
            <a
              href="javascript:void(0);"
              class="dropdown-item d-flex flex-row border-bottom py-2"
              class:notification-unread={notification.status === 'NOT_READ'}>
              <div class="col-auto pl-0">
                <Icon data={faDotCircle} class="text-primary" />
              </div>
              <div class="col">
                <span class="text-wrap text-dark">{notification.type_ID}</span>
                <small class="text-gray">
                  {moment(notification.date).fromNow()}
                </small>
              </div>
            </a>
          {/each}
        {/if}

        {#if quickNotifications.length === 0 && !notificationsLoading}
          <div
            class="d-flex flex-column align-items-center justify-content-center">
            <Icon data={faBell} scale="3" class="text-glass m-3" />
            <p class="text-gray">Bildirim yok.</p>
          </div>
        {/if}

        <!-- Loading Spinner -->
        {#if notificationsLoading}
          <div class="d-flex justify-content-center m-3">
            <div
              class="spinner-border spinner-border-sm text-primary"
              role="status" />
          </div>
        {/if}

        <a
          class="dropdown-item text-primary font-weight-bolder text-center small
          pt-2"
          href="/panel/notifications">
          Tümünü Görüntüle {$notificationsCount === 0 ? '' : '— ' + $notificationsCount}
        </a>
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
