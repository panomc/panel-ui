<!-- Top Navbar -->
<nav class="navbar navbar-expand navbar-light">
  <ul class="nav navbar-nav mr-auto">
    <li class="nav-item mr-2">
      <a
        class="icon-link nav-link"
        class:invisible="{$isSidebarOpen}"
        href="javascript:void(0);"
        title="Menüyü Aç/Kapa"
        on:click="{onSideBarCollapseClick}"
      >
        <i class="fas fa-bars"></i>
      </a>
    </li>
    <li class="nav-item d-none">
      <a
        href="javascript:void(0);"
        target="_blank"
        class="btn btn-link border-lightprimary text-secondary"
      >
        <i class="fas fa-store d-lg-none d-inline"></i>
        <span class="d-lg-inline d-none">Web Market</span>
      </a>
    </li>
  </ul>

  <div class="h4 m-0">Panel</div>

  <!-- Notifications Dropdown -->

  <ul class="nav navbar-nav ml-auto">
    <li class="nav-item dropdown" id="quickNotificationsDropdown">
      <a
        class="icon-link nav-link position-relative"
        data-toggle="dropdown"
        href="javascript:void(0);"
        role="button"
        title="Bildirimler"
      >
        {#if $notificationsCount !== 0}
          <div class="unread-badge"></div>
        {/if}
        <i class="fas fa-bell"></i>
      </a>

      <div
        class="dropdown-menu animated fadeIn faster dropdown-menu-right
        notifications"
      >
        <h6 class="dropdown-header">
          Bildirimler {$notificationsCount === 0
            ? ""
            : "(" + $notificationsCount + " Okunmamış)"}
        </h6>

        {#if !notificationsLoading}
          {#each quickNotifications as notification, index (notification)}
            <a
              href="javascript:void(0);"
              class="dropdown-item d-flex flex-row border-bottom py-2"
              class:notification-unread="{notification.status === 'NOT_READ'}"
            >
              <div class="col-auto pl-0">
                <i class="fas fa-dot-circle text-primary"></i>
              </div>
              <div class="col">
                <span class="text-wrap text-dark">{notification.type_ID}</span>
                <small class="text-gray d-block">
                  {getTime(checkTime, parseInt(notification.date), "")}
                </small>
              </div>
            </a>
          {/each}
        {/if}

        {#if quickNotifications.length === 0 && !notificationsLoading}
          <div
            class="d-flex flex-column align-items-center justify-content-center"
          >
            <i class="fas fa-bell text-glass m-3"></i>
            <p class="text-gray">Bildirim yok.</p>
          </div>
        {/if}

        <!-- Loading Spinner -->
        {#if notificationsLoading}
          <div class="d-flex justify-content-center m-3">
            <div
              class="spinner-border spinner-border-sm text-primary"
              role="status"
            ></div>
          </div>
        {/if}

        <a
          class="dropdown-item text-primary font-weight-bolder text-center small
          pt-2"
          href="{base}/notifications"
        >
          Tümünü Görüntüle
        </a>
      </div>
    </li>

    <li class="nav-item dropdown">
      <a
        aria-expanded="false"
        aria-haspopup="true"
        class="icon-link nav-link p-1"
        data-toggle="dropdown"
        href="javascript:void(0);"
        title="Oturum"
      >
        <img
          src="https://minotar.net/avatar/{$user.username}"
          width="32"
          height="32"
          class="border rounded-circle"
          alt="{$user.username}"
        />
      </a>
      <div class="dropdown-menu dropdown-menu-right animated fadeIn faster">
        <ul class="nav flex-column">
          <li class="nav-item">
            <a
              class="nav-link text-primary"
              href="{base}/players/player/{$user.username}"
            >
              <i class="fas fa-user mr-1"></i>
              {$user.username}
            </a>
          </li>
          <li class="nav-item">
            <a
              class="nav-link"
              href="javascript:void(0);"
              on:click="{onLogout}"
            >
              <i class="fas fa-sign-out-alt mr-1"></i>
              Çıkış Yap
            </a>
          </li>
        </ul>
      </div>
    </li>
  </ul>
</nav>

<script>
  import jQuery from "jquery";
  import { onMount, onDestroy } from "svelte";
  import { formatDistanceToNow } from "date-fns";

  import { base } from "$app/paths";
  import { browser } from "$app/env";

  import { ApiUtil } from "$lib/api.util";
  import {
    toggleSidebar,
    notificationsCount,
    user,
    logoutLoading,
    showNetworkErrorOnCatch,
    isSidebarOpen,
  } from "$lib/store";

  let notificationsLoading = true;
  let quickNotifications = [];
  let quickNotificationProcessID = 0;

  let checkTime = 0;
  let interval;

  Array.prototype.insert = function (index, item) {
    this.splice(index, 0, item);

    return this;
  };

  Array.prototype.remove = function (index) {
    this.splice(index, 1);

    return this;
  };

  function onSideBarCollapseClick() {
    toggleSidebar();
  }

  function onLogout() {
    logoutLoading.set(true);

    showNetworkErrorOnCatch((resolve, reject) => {
      ApiUtil.post("auth/logout", {})
        .then(() => {
          window.location.href = "/";

          resolve();
        })
        .catch(() => {
          reject();
        });
    });
  }

  function setNotifications(newNotifications) {
    if (quickNotifications.length === 0 || newNotifications.length === 0)
      quickNotifications = newNotifications;
    else {
      const listOfFilterIsNotificationExists = [];

      newNotifications.forEach((item, index) => {
        listOfFilterIsNotificationExists[index] = quickNotifications.filter(
          (filterItem) => filterItem.id === item.id
        );
      });

      newNotifications.forEach((item, index) => {
        if (listOfFilterIsNotificationExists[index].length === 0) {
          quickNotifications = quickNotifications.insert(index, item);
        }
      });

      quickNotifications.forEach((item, index) => {
        const newArrayOfFilter = newNotifications.filter(
          (filterItem) => filterItem.id === item.id
        );

        if (newArrayOfFilter.length === 0) {
          quickNotifications = quickNotifications.remove(index);
        }
      });
    }
  }

  function getQuickNotificationsAndRead(id) {
    showNetworkErrorOnCatch((resolve, reject) => {
      ApiUtil.get("panel/quickNotificationsAndRead")
        .then((response) => {
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
    });
  }

  function getQuickNotifications(id) {
    showNetworkErrorOnCatch((resolve, reject) => {
      ApiUtil.get("panel/quickNotifications")
        .then((response) => {
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
    });
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

  function getTime(check, time, locale) {
    return formatDistanceToNow(time, { addSuffix: true });
  }

  onMount(() => {
    jQuery("#quickNotificationsDropdown")
      .on("show.bs.dropdown", function () {
        notificationsLoading = true;
        quickNotifications = [];
        startQuickNotificationsAndReadCountDown();
      })
      .on("hide.bs.dropdown", function () {
        startQuickNotificationsCountDown();
      });

    interval = setInterval(() => {
      checkTime += 1;
    }, 1000);
  });

  if (browser) {
    startQuickNotificationsCountDown();
  }

  onDestroy(() => {
    clearInterval(interval);
  });
</script>
