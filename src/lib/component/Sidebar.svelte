<ServersModal />
<ConnectServerModal />
<RemoveServerModal />

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
    <div class="sidebar-info m-2">
      <a href="{base}/settings/site-settings">
        <img
          alt="Sunucu İkonu"
          class="img-fluid"
          src="{$websiteLogoSrc}"
          use:tooltip="{['Website Ayaları', { placement: 'right' }]}" />
      </a>

      {#if $sidebarTabsState === "game" && $selectedServer}
        <h5 class="text-light">{$selectedServer.name}</h5>
      {:else}
        <h5 class="text-light">{$website.name}</h5>
      {/if}

      {#if $sidebarTabsState === "website"}
        <a href="{UI_URL}" class="btn btn-sm btn-secondary" target="_blank">
          Websiteyi Görüntüle
        </a>
      {/if}

      {#if $sidebarTabsState === "game"}
        <button
          class="btn btn-sm btn-aqua"
          type="button"
          on:click="{showServersModal}">
          Sunucuları Görüntüle
        </button>
      {/if}
    </div>

    <!-- Sidebar Tabs -->
    <ul class="sidebar-tab nav nav-pills nav-fill flex-row flex-nowrap p-2">
      <li class="nav-item">
        <a
          href="javascript:void(0);"
          class="nav-link"
          use:tooltip="{['Website', { placement: 'bottom' }]}"
          on:click="{onWebsiteMenuClick}"
          class:active="{$sidebarTabsState === 'website'}"
          class:text-light="{$sidebarTabsState !== 'website'}">
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
            class:active="{$sidebarTabsState === 'game'}"
            class:text-light="{$sidebarTabsState !== 'game'}">
            <i class="fas fa-cube fa-lg"></i>
          </a>
        </li>
      {/if}
    </ul>

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

  import {
    toggleSidebar,
    isSidebarOpen,
    setSidebarTabsState,
    sidebarTabsState,
    website,
    selectedServer,
  } from "$lib/Store";

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

  let menuComponent = SiteNavigationMenu;

  const unsubscribeSidebarTabsState = sidebarTabsState.subscribe((value) => {
    if (value === "website") {
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
