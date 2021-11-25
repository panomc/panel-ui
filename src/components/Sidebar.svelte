<ServersModal />
<ConnectServerModal />
<RemoveServerModal />

<div class="sidebar bg-primary" class:active="{$isSidebarOpen}">
  <!-- Sidebar Logo -->
  <div class="sidebar-logo border-bottom border-glass">
    <a
      href="javascript:void(0);"
      class="sidebar-toggler btn btn-link text-light"
      on:click="{onMobileSideBarCollapseClick}">
      <i class="fas fa-bars"></i>
    </a>

    <a href="{base}/">
      <img
        alt="Pano"
        title="Pano"
        src="{base + '/assets/img/logo.svg'}"
        width="20" />
    </a>
  </div>

  <div class="sidebar-inner border-glass border-right">
    <!-- Sidebar Info Section -->
    <div class="sidebar-info">
      <img
        alt="Server İkon"
        title="{$website.name}"
        class="sidebar-server-icon"
        width="80"
        height="80"
        src="http://icons.iconarchive.com/icons/ampeross/lamond/256/minecraft-icon.png" />
      <h5 class="text-light">{$website.name}</h5>

      {#if $sidebarTabsState === "website"}
        <a href="/" class="z-1" target="_blank">
          <button class="btn btn-secondary btn-sm" type="button">
            Websiteyi Görüntüle
          </button>
        </a>
      {/if}

      {#if $sidebarTabsState === "game"}
        <a href="javascript:void(0);" class="z-1">
          <button
            class="btn btn-aqua btn-sm text-white"
            data-target="#showServers"
            data-toggle="modal"
            type="button">
            Sunucuları Görüntüle
          </button>
        </a>
      {/if}
    </div>

    <!-- Sidebar Tabs -->
    <ul class="sidebar-tab nav nav-pills nav-fill flex-row flex-nowrap p-2">
      <li class="nav-item">
        <a
          href="javascript:void(0)"
          class="nav-link"
          on:click="{onWebsiteMenuClick}"
          class:active="{$sidebarTabsState === 'website'}"
          class:text-light="{$sidebarTabsState !== 'website'}">
          <i class="fas fa-globe fa-1g"></i>
        </a>
      </li>
      <li class="nav-item">
        <a
          href="javascript:void(0)"
          class="nav-link"
          on:click="{onGameMenuClick}"
          class:active="{$sidebarTabsState === 'game'}"
          class:text-light="{$sidebarTabsState !== 'game'}">
          <i class="fas fa-cube fa-1g"></i>
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
