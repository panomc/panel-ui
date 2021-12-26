<!-- Navbar -->
<nav class="navbar navbar-expand navbar-light">
  <div class="container-fluid">
    <!-- Navbar Toggler -->
    <div class="navbar-nav ml-auto">
      <a
        href="#"
        class="nav-link"
        class:invisible="{$isSidebarOpen}"
        title="Menüyü Aç/Kapa"
        on:click="{onSideBarCollapseClick}">
        <i class="fas fa-bars"></i>
      </a>
    </div>
    <div class="container pl-5">
      <!-- Page Title -->
      <h4 class="mb-0">
        {$pageTitle ? $pageTitle : options.DEFAULT_PAGE_TITLE}
      </h4>
    </div>
    <div class="navbar-nav">
    <!-- Notifications Dropdown -->
      <div class="nav-item dropdown">
        <a
          href="#"
          class="nav-link"
          data-bs-toggle="dropdown"
          role="button"
          title="Bildirimler">
          <!-- {#if $notificationsCount !== 0}
            <div class="unread-badge"></div>
          {/if} -->
          <i class="fas fa-bell"></i>
        </a>

        <div
          class="dropdown-menu dropdown-menu-end animate__animated animate__zoomInUp">
          <h6 class="dropdown-header">
            Bildirimler {$notificationsCount === 0
              ? ""
              : "(" + $notificationsCount + " Okunmamış)"}
          </h6>
          <li><hr class="dropdown-divider" /></li>

          {#if !notificationsLoading}
            {#each quickNotifications as notification, index (notification)}
              <a
                href="#"
                class="dropdown-item d-flex flex-row border-bottom py-2"
                class:notification-unread="{notification.status ===
                  'NOT_READ'}">
                <div class="col-auto pl-0">
                  <i class="fas fa-dot-circle text-primary"></i>
                </div>
                <div class="col">
                  <span class="text-wrap text-dark"
                    >{notification.type_ID}</span>
                  <small class="text-gray d-block">
                    {getTime(checkTime, parseInt(notification.date), "")}
                  </small>
                </div>
              </a>
            {/each}
          {/if}

          {#if quickNotifications.length === 0 && !notificationsLoading}
            <div
              class="d-flex flex-column align-items-center justify-content-center">
              <i class="fas fa-2x fa-bell text-gray m-2"></i>
              <span class="text-gray">Bildirim yok.</span>
            </div>
          {/if}

          <!-- Loading Spinner -->
          {#if notificationsLoading}
            <div class="d-flex justify-content-center m-3">
              <div
                class="spinner-border spinner-border-sm text-primary"
                role="status">
              </div>
            </div>
          {/if}

          <a
            class="dropdown-item text-center small"
            href="{base}/notifications">
            Tümünü Görüntüle
          </a>
        </div>
      </div>
      
    <!-- Account Dropdown -->
      <div class="nav-item dropdown">
        <a
          href="#"
          class="nav-link"
          data-bs-toggle="dropdown"
          role="button"
          title="Oturum">
          <img
            src="https://minotar.net/avatar/{$user.username}"
            width="32"
            height="32"
            class="border rounded-circle animate__animated animate__zoomIn"
            alt="{$user.username}" />
        </a>
        <ul
          class="dropdown-menu dropdown-menu-end animate__animated animate__zoomInUp">
          <h6 class="dropdown-header">{$user.username}</h6>
          <li><hr class="dropdown-divider" /></li>
          <li>
            <a
              class="dropdown-item"
              href="{base}/players/player/{$user.username}">
              Profil
            </a>
          </li>
          <li>
            <a class="dropdown-item" href="#" on:click="{onLogout}">
              Çıkış Yap
            </a>
          </li>
        </ul>
      </div>
    </div>
  </div>
</nav>

<script>
  import jQuery from "jquery";
  import { onMount, onDestroy } from "svelte";
  import { formatDistanceToNow } from "date-fns";

  import { base } from "$app/paths";
  import { browser } from "$app/env";
  import { session } from "$app/stores";

  import ApiUtil from "$lib/api.util";
  import {
    toggleSidebar,
    notificationsCount,
    user,
    logoutLoading,
    showNetworkErrorOnCatch,
    isSidebarOpen,
    pageTitle,
    options,
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
      ApiUtil.post({ path: "/auth/logout", CSRFToken: $session.CSRFToken })
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
      ApiUtil.get({
        path: "/api/panel/quickNotificationsAndRead",
        CSRFToken: $session.CSRFToken,
      })
        .then((body) => {
          if (quickNotificationProcessID === id) {
            if (body.result === "ok") {
              setNotifications(body.notifications);
              notificationsCount.set(body.notifications_count);

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
      ApiUtil.get({
        path: "/api/panel/quickNotifications",
        CSRFToken: $session.CSRFToken,
      })
        .then((body) => {
          if (quickNotificationProcessID === id) {
            if (body.result === "ok") {
              notificationsCount.set(body.notifications_count);
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
