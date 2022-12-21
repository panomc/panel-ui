<style>
  .notifications {
    width: 250px;
  }
</style>

<!-- Navbar -->
<nav class="navbar navbar-expand navbar-light">
  <div class="container">
    <div class="row w-100 justify-content-between align-items-center">
      <div class="col-4 d-flex justify-content-start">
        <!-- Navbar Toggler -->
        <div class="navbar-nav">
          <a
            class="nav-link"
            class:invisible="{$isSidebarOpen}"
            href="javascript:void(0);"
            title="Menüyü Aç/Kapa"
            on:click="{onSideBarCollapseClick}">
            <i class="fa-solid fa-bars"></i>
          </a>
        </div>
      </div>
      <div class="col-4 d-flex justify-content-center">
        <!-- Page Title -->
        <h4 class="text-black">
          {$pageTitle ? $pageTitle : options.DEFAULT_PAGE_TITLE}
        </h4>
      </div>
      <div class="col-4 d-flex justify-content-end">
        <div class="navbar-nav">
          <!-- Notifications Dropdown -->
          <div
            class="nav-item dropdown d-flex align-items-center"
            id="quickNotificationsDropdown">
            <a
              href="javascript:void(0);"
              class="nav-link position-relative"
              data-bs-toggle="dropdown"
              role="button"
              title="Bildirimler">
              <i class="fas fa-bell fa-lg"></i>
              {#if $notificationsCount !== 0}
                <span
                  class="position-absolute p-2 start-75 translate-middle badge rounded-pill bg-danger">
                  {$notificationsCount}
                </span>
              {/if}
            </a>

            <div
              class="dropdown-menu dropdown-menu-end animate__animated animate__zoomInUp">
              <h6 class="dropdown-header">
                Bildirimler {$notificationsCount === 0
                  ? ""
                  : "(" + $notificationsCount + ")"}
              </h6>

              {#if $quickNotifications.length === 0}
                <div
                  class="d-flex flex-column align-items-center justify-content-center mb-3">
                  <i class="fas fa-2x fa-bell text-gray mx-5 my-3"></i>
                  <small class="text-gray">Yeni bildirim yok.</small>
                </div>
              {:else}

              {#each $quickNotifications as notification, index (notification)}
              <a href="#" class="dropdown-item" class:notification-unread="{notification.status ===
                'NOT_READ'}">
                <p class="mb-0">{notification.typeId}</p>
                <small class="text-dark">
                  {getTime(checkTime, parseInt(notification.date), "")}
                </small>
              </a>
              {/each}
              
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
              href="javascript:void(0);"
              class="nav-link"
              data-bs-toggle="dropdown"
              role="button"
              title="Oturum">
              <img
                src="https://crafthead.net/avatar/{$user.username}"
                width="32"
                height="32"
                class="rounded-circle animate__animated animate__zoomIn"
                alt="{$user.username}" />
            </a>
            <ul
              class="dropdown-menu dropdown-menu-end animate__animated animate__zoomInUp">
              <h6 class="dropdown-header text-black">{$user.username}</h6>
              <li>
                <a
                  class="dropdown-item"
                  href="{base}/players/player/{$user.username}">
                  Profil
                </a>
              </li>
              <li>
                <a
                  class="dropdown-item text-danger"
                  href="javascript:void(0);"
                  on:click="{onLogout}">
                  Çıkış Yap
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</nav>

<script>
  import { onDestroy, onMount } from "svelte";
  import { formatDistanceToNow } from "date-fns";

  import { base } from "$app/paths";

  import ApiUtil from "$lib/api.util";
  import {
    isSidebarOpen,
    logoutLoading,
    notificationsCount,
    options,
    pageTitle,
    quickNotifications,
    showNetworkErrorOnCatch,
    toggleSidebar,
    user,
  } from "$lib/Store";
  import { onNotificationClick } from "$lib/NotificationManager.js";

  let quickNotificationProcessID = 0;

  let checkTime = 0;
  let interval;

  function onSideBarCollapseClick() {
    toggleSidebar();
  }

  function onLogout() {
    logoutLoading.set(true);

    showNetworkErrorOnCatch((resolve, reject) => {
      ApiUtil.post({ path: "/auth/logout" })
        .then(() => {
          window.location.href = "/";

          resolve();
        })
        .catch(() => {
          reject();
        });
    });
  }

  function markQuickNotificationsAsRead(id) {
    showNetworkErrorOnCatch((resolve, reject) => {
      ApiUtil.post({
        path: "/api/panel/notifications/quick/markAsRead",
      })
        .then((body) => {
          if (quickNotificationProcessID === id) {
            if (body.result === "ok") {
              notificationsCount.set(body.notificationCount);
            }

            setTimeout(() => {
              if (quickNotificationProcessID === id) {
                startMarkQuickNotificationsAsReadCountDown();
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

  function startMarkQuickNotificationsAsReadCountDown() {
    quickNotificationProcessID++;

    const id = quickNotificationProcessID;

    markQuickNotificationsAsRead(id);
  }

  function getTime(check, time, locale) {
    return formatDistanceToNow(time, { addSuffix: true });
  }

  onMount(() => {
    const dropdown = document.getElementById("quickNotificationsDropdown");

    dropdown.addEventListener("show.bs.dropdown", function () {
      startMarkQuickNotificationsAsReadCountDown();
    });

    dropdown.addEventListener("hide.bs.dropdown", function () {
      quickNotificationProcessID++;
    });

    interval = setInterval(() => {
      checkTime += 1;
    }, 1000);
  });

  onDestroy(() => {
    clearInterval(interval);
  });
</script>
