<script>
  import { basePath } from "../util/path.util";
  import {
    toggleSidebar,
    isSidebarOpen,
    setSidebarTabsState,
    sidebarTabsState,
    website,
  } from "../Store";
  import { onDestroy } from "svelte";

  import Bottom from "./sidebar/Bottom.svelte";
  import SiteNavigationMenu from "./sidebar/SiteNavigationMenu.svelte";
  import ServerNavigationMenu from "./sidebar/ServerNavigationMenu.svelte";

  import Icon from "svelte-awesome";
  import { faBars, faGlobe, faCube } from "@fortawesome/free-solid-svg-icons";

  import ServersModal from "./modals/ServersModal.svelte";
  import ConnectServerModal from "./modals/ConnectServerModal.svelte";
  import RemoveServerModal from "./modals/RemoveServerModal.svelte";

  let menuComponent = SiteNavigationMenu;

  function onMobileSideBarCollapseClick() {
    toggleSidebar();
  }

  const unsubscribeSidebarTabsState = sidebarTabsState.subscribe((value) => {
    if (value === "website") {
      menuComponent = SiteNavigationMenu;
    } else {
      menuComponent = ServerNavigationMenu;
    }
  });

  onDestroy(unsubscribeSidebarTabsState);

  function onWebsiteMenuClick() {
    setSidebarTabsState("website");
  }

  function onGameMenuClick() {
    setSidebarTabsState("game");
  }
</script>

<ServersModal />
<ConnectServerModal />
<RemoveServerModal />

<!-- Sidebar -->
<div class="sidebar" class:active="{$isSidebarOpen}">

  <!-- Sidebar Logo -->
  <div class="sidebar-logo border-bottom border-glass border-right">
    <a
      href="javascript:void(0);"
      class="sidebar-toggler btn btn-link text-muted"
      on:click="{onMobileSideBarCollapseClick}"
    >
      <Icon data="{faBars}" />
    </a>
    <img
      alt="Pano"
      title="Pano"
      src="{basePath() + 'assets/img/logo-blue.svg'}"
      width="20"
    />
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
        src="http://icons.iconarchive.com/icons/ampeross/lamond/256/minecraft-icon.png"
      />
      <h5 class="text-dark">{$website.name}</h5>

      {#if $sidebarTabsState === 'website'}
        <a href="/" class="z-1" target="_blank">
          <button class="btn btn-secondary btn-sm" type="button">
            Websiteyi Görüntüle
          </button>
        </a>
      {/if}

      {#if $sidebarTabsState === 'game'}
        <a href="javascript:void(0);" class="z-1">
          <button
            class="btn btn-aqua btn-sm text-white"
            data-target="#showServers"
            data-toggle="modal"
            type="button"
          >
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
          class:text-muted="{$sidebarTabsState !== 'website'}"
        >
          <Icon data="{faGlobe}" scale="1.3" />
        </a>
      </li>
      <li class="nav-item">
        <a
          href="javascript:void(0)"
          class="nav-link"
          on:click="{onGameMenuClick}"
          class:active="{$sidebarTabsState === 'game'}"
          class:text-muted="{$sidebarTabsState !== 'game'}"
        >
          <Icon data="{faCube}" scale="1.3" />
        </a>
      </li>
    </ul>

    <!-- Sidebar Site Navigation Menu || Sidebar Server Navigation Menu -->
    <svelte:component this="{menuComponent}" />
  </div>

  <!-- Sidebar Bottom -->
  <Bottom />
</div>
