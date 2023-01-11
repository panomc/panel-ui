{#if hasPermission(Permissions.MANAGE_SERVERS)}
  <ServersModal />
  <ConnectServerModal />
  <RemoveServerModal />
{/if}

<div class="sidebar bg-primary" class:active="{$isSidebarOpen}">
  <!-- Sidebar Toggler & Logo -->
  <div class="navbar navbar-dark w-100 px-2">
    <button
      type="button"
      class="btn btn-link link-white position-absolute"
      title="Menüyü Aç/kapa"
      on:click="{onMobileSideBarCollapseClick}"
      ><i class="fa-solid fa-bars"></i>
    </button>

    <a class="navbar-brand m-auto" href="{base}/">
      <img
        alt="Pano"
        title="Pano"
        src="{base + '/assets/img/logo.svg'}"
        width="20" />
    </a>
  </div>

  <div class="sidebar-inner">
    <!-- Sidebar Info Section -->
    <div class="sidebar-info m-3">
      <a href="{base}/settings/site-settings">
        <img
          alt="Sunucu İkonu"
          class="img-fluid"
          src="{$websiteLogoSrc}"
          use:tooltip="{['Website Ayaları', { placement: 'right' }]}" />
      </a>

      {#if $sidebarTabsState === "game" && $selectedServer}
        <h5 class="text-white animate__animated animate__zoomIn">
          {$selectedServer.name}
        </h5>
      {:else}
        <h5 class="text-light animate__animated animate__zoomIn">
          {$website.name}
        </h5>
      {/if}

      {#if $sidebarTabsState === "website"}
        <a href="{UI_URL}" class="btn btn-sm btn-secondary" target="_blank">
          Websiteyi Görüntüle
        </a>
      {/if}

      {#if $sidebarTabsState === "game"}
        <button
          class="btn btn-sm btn-secondary"
          type="button"
          on:click="{showServersModal}">
          Sunucuları Görüntüle
        </button>
      {/if}
    </div>

    <!-- Sidebar Tabs -->
    <div class="navbar navbar-expand navbar-dark w-100">
      <ul
        class="navbar-nav d-flex flex-row justify-content-evenly align-items-center w-100">
        <li class="nav-item">
          <a
            href="javascript:void(0);"
            class="nav-link"
            use:tooltip="{['Website', { placement: 'bottom' }]}"
            on:click="{onWebsiteMenuClick}"
            class:active="{$sidebarTabsState === 'website'}">
            <i class="fas fa-globe fa-lg"></i>
          </a>
        </li>
        {#if hasPermission(Permissions.MANAGE_SERVERS)}
          <li class="nav-item">
            <a
              href="javascript:void(0);"
              class="nav-link"
              use:tooltip="{['Sunucu', { placement: 'bottom' }]}"
              on:click="{onGameMenuClick}"
              class:active="{$sidebarTabsState === 'game'}">
              <i class="fas fa-cube fa-lg"></i>
            </a>
          </li>
        {/if}
      </ul>
    </div>

    <!-- Sidebar Site Navigation Menu || Sidebar Server Navigation Menu -->
    <svelte:component this="{menuComponent}" />
  </div>

  <!-- Sidebar Bottom -->
  <Bottom />
</div>

<script>
  import { onDestroy } from "svelte";

  import { base } from "$app/paths";

  import tooltip from "$lib/tooltip.util";

  import { toggleSidebar, setSidebarTabsState } from "$lib/Store";

  import Bottom from "./sidebar/Bottom.svelte";

  import SiteNavigationMenu from "./sidebar/SiteNavigationMenu.svelte";
  import ServerNavigationMenu from "./sidebar/ServerNavigationMenu.svelte";

  import ServersModal, {
    show as showServersModal,
  } from "./modals/ServersModal.svelte";
  import ConnectServerModal from "./modals/ConnectServerModal.svelte";
  import RemoveServerModal from "./modals/RemoveServerModal.svelte";
  import { UI_URL } from "$lib/variables.js";

  import { websiteLogoSrc } from "$lib/Store.js";
  import { hasPermission, Permissions } from "$lib/auth.util.js";
  import { page } from "$app/stores";

  let menuComponent = SiteNavigationMenu;

  const { website, sidebarTabsState, isSidebarOpen, selectedServer } =
    $page.data;

  const unsubscribeSidebarTabsState = sidebarTabsState.subscribe((value) => {
    if (value === "website" || !hasPermission(Permissions.MANAGE_SERVERS)) {
      menuComponent = SiteNavigationMenu;
    } else {
      menuComponent = ServerNavigationMenu;
    }
  });

  function onMobileSideBarCollapseClick() {
    toggleSidebar();
  }

  function onWebsiteMenuClick() {
    setSidebarTabsState("website");
  }

  function onGameMenuClick() {
    setSidebarTabsState("game");
  }

  onDestroy(unsubscribeSidebarTabsState);
</script>
