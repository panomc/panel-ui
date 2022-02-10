<ServersModal />
<ConnectServerModal />
<RemoveServerModal />

<div class="sidebar bg-primary" class:active="{$isSidebarOpen}">
  <!-- Sidebar Toggler & Logo -->
  <div class="navbar navbar-dark w-100 px-2">
    <button
      type="button"
      class="navbar-toggler position-absolute"
      title="Menüyü Aç/kapa"
      on:click="{onMobileSideBarCollapseClick}">
      <i class="fas fa-bars"></i>
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
    <div class="sidebar-info">
      <a href="{base}/settings/site-settings">
        <img
          alt="Server İkon"
          class="m-2 rounded-circle"
          width="64"
          height="64"
          src="https://www.minecraft.net/etc.clientlibs/minecraft/clientlibs/main/resources/img/minecraft-creeper-face.jpg"
          use:tooltip="{['Website Ayaları', { placement: 'right' }]}" />
      </a>

      <h5 class="text-light">{$website.name}</h5>

      {#if $sidebarTabsState === "website"}
        <a href="/" class="btn btn-sm btn-secondary" target="_blank">
          Websiteyi Görüntüle
        </a>
      {/if}

      {#if $sidebarTabsState === "game"}
        <button
          class="btn btn-sm btn-aqua"
          data-bs-target="#showServers"
          data-bs-toggle="modal"
          type="button">
          Sunucuları Görüntüle
        </button>
      {/if}
    </div>

    <!-- Sidebar Tabs -->
    <ul class="sidebar-tab nav nav-pills nav-fill flex-row flex-nowrap p-2">
      <li class="nav-item">
        <a
          href="#"
          class="nav-link"
          use:tooltip="{['Website', { placement: 'bottom' }]}"
          on:click="{onWebsiteMenuClick}"
          class:active="{$sidebarTabsState === 'website'}"
          class:text-light="{$sidebarTabsState !== 'website'}">
          <i class="fas fa-globe fa-lg"></i>
        </a>
      </li>
      <li class="nav-item">
        <a
          href="javascript:void(0)"
          class="nav-link"
          use:tooltip="{['Sunucu', { placement: 'bottom' }]}"
          on:click="{onGameMenuClick}"
          class:active="{$sidebarTabsState === 'game'}"
          class:text-light="{$sidebarTabsState !== 'game'}">
          <i class="fas fa-cube fa-lg"></i>
        </a>
      </li>
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
  } from "$lib/store";

  import Bottom from "./sidebar/Bottom.svelte";

  import SiteNavigationMenu from "./sidebar/SiteNavigationMenu.svelte";
  import ServerNavigationMenu from "./sidebar/ServerNavigationMenu.svelte";

  import ServersModal from "./modals/ServersModal.svelte";
  import ConnectServerModal from "./modals/ConnectServerModal.svelte";
  import RemoveServerModal from "./modals/RemoveServerModal.svelte";

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
