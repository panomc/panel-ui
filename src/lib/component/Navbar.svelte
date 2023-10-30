<!-- Navbar -->
<nav class="navbar navbar-expand navbar-light bg-body-light">
  <div class="container-fluid">
    <div class="row w-100 justify-content-between align-items-center">
      <div class="col-4 d-flex justify-content-start">
        <!-- Navbar Toggler -->
        <div class="navbar-nav">
          <button
            class="navbar-toggler d-block"
            class:invisible="{$isSidebarOpen}"
            type="button"
            title="{$_('components.navbar.navbar-toggle-tooltip')}"
            on:click="{onSideBarCollapseClick}">
            <i class="fa-solid fa-bars"></i>
          </button>
        </div>
      </div>
      <div class="col-4 d-flex justify-content-center">
        <!-- Page Title -->
        <h5 class="navbar-text mb-0">
          {$pageTitle ? $_($pageTitle) : options.DEFAULT_PAGE_TITLE}
        </h5>
      </div>
      <div class="col-4 d-flex justify-content-end">
        <div class="navbar-nav ml-auto">
          <!-- Notifications Dropdown -->
          <div
            class="nav-item dropdown d-flex align-items-center"
            id="quickNotificationsDropdown">
            <a
              href="javascript:void(0);"
              class="nav-link"
              data-bs-toggle="dropdown"
              role="button"
              title="{$_('components.navbar.notifications')}">
              <i class="fas fa-bell fa-lg"></i>
              {#if $notificationCount !== 0}
                <span
                  class="position-absolute p-2 start-75 translate-middle badge rounded-pill bg-danger">
                  {$notificationCount}
                </span>
              {/if}
            </a>

            <div
              class="dropdown-menu dropdown-menu-end animate__animated animate__zoomInUp">
              <h6 class="dropdown-header">
                {$_('components.navbar.notifications')} {$notificationCount === 0
                  ? ""
                  : "(" + $notificationCount + ")"}
              </h6>

              {#if $quickNotifications.length === 0}
                <NoContent />
              {:else}
                {#each $quickNotifications as notification, index (notification)}
                  <a
                    href="javascript:void(0);"
                    on:click="{() => onNotificationClick(notification)}"
                    class="dropdown-item"
                    class:notification-unread="{notification.status ===
                      'NOT_READ'}">
                    <p class="mb-0">{notification.type}</p>
                    <small class="text-dark">
                      {getTime(checkTime, parseInt(notification.date), locales[$currentLanguage['date-fns-code']])}
                    </small>
                  </a>
                {/each}
              {/if}

              <a
                class="dropdown-item text-center small"
                href="{base}/notifications">
                {$_('components.navbar.show-all')}
              </a>
            </div>
          </div>

          <!-- Account Dropdown -->
          <div class="nav-item dropdown">
            <button
              type="button"
              class="nav-link"
              data-bs-toggle="dropdown"
              title="{$_('components.navbar.account-dropdown.session')}">
              <img
                src="https://minotar.net/avatar/{$user.username}"
                width="32"
                height="32"
                class="rounded-circle animate__animated animate__zoomIn"
                alt="{$user.username}" />
            </button>
            <ul
              class="dropdown-menu dropdown-menu-end animate__animated animate__zoomInUp">
              <h6 class="dropdown-header">{$user.username}</h6>
              <li>
                <a
                  class="dropdown-item"
                  href="{base}/players/player/{$user.username}">
                  {$_('components.navbar.account-dropdown.profile')}
                </a>
              </li>
              <li>
                <button
                  type="button"
                  class="dropdown-item text-danger"
                  on:click="{onLogout}">
                  {$_('components.navbar.account-dropdown.logout')}
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</nav>

<script>
  import { onDestroy, onMount, getContext } from "svelte";
  import { formatDistanceToNow } from "date-fns";
  import { _ } from "svelte-i18n";
  import * as locales from "date-fns/locale";

  import { base } from "$app/paths";

  import ApiUtil from "$lib/api.util";
  import {
    logoutLoading,
    options,
    quickNotifications,
    showNetworkErrorOnCatch,
    toggleSidebar,
  } from "$lib/Store";
  import { onNotificationClick } from "$lib/NotificationManager.js";
  import NoContent from "$lib/component/NoContent.svelte";
  import { currentLanguage } from "$lib/language.util.js";

  let quickNotificationProcessID = 0;

  let checkTime = 0;
  let interval;

  const pageTitle = getContext("pageTitle");
  const user = getContext("user");
  const notificationCount = getContext("notificationCount");
  const isSidebarOpen = getContext("isSidebarOpen");

  function onSideBarCollapseClick() {
    toggleSidebar(isSidebarOpen);
  }

  function onLogout() {
    logoutLoading.set(true);

    showNetworkErrorOnCatch((resolve, reject) => {
      ApiUtil.post({ path: "/api/auth/logout" })
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
              notificationCount.set(body.notificationCount);
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
    return formatDistanceToNow(time, { addSuffix: true, locale });
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
