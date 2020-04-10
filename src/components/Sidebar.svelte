<script>
  import {basePath} from "../util/path.util";
  import {toggleSidebar, isSidebarOpen, setSidebarTabsState, sidebarTabsState} from "../Store"
  import {onDestroy} from "svelte"

  import Bottom from "./sidebar/Bottom.svelte"
  import SiteNavigationMenu from "./sidebar/SiteNavigationMenu.svelte";
  import ServerNavigationMenu from "./sidebar/ServerNavigationMenu.svelte";

  import Icon from "svelte-awesome";
  import {
    faBars,
    faGlobe,
    faCube
  } from "@fortawesome/free-solid-svg-icons";

  let menuComponent = SiteNavigationMenu;

  function onMobileSideBarCollapseClick() {
    toggleSidebar();
  }

  const unsubscribeSidebarTabsState = sidebarTabsState.subscribe(value => {
    if (value === "website") {
      menuComponent = SiteNavigationMenu;
    } else {
      menuComponent = ServerNavigationMenu;
    }
  });

  onDestroy(unsubscribeSidebarTabsState)

  function onWebsiteMenuClick() {
    setSidebarTabsState("website")
  }

  function onGameMenuClick() {
    setSidebarTabsState("game")
  }
</script>

<!-- Sidebar -->
<aside class="sidebar bg-primary" class:active={$isSidebarOpen}>

  <!-- Sidebar Logo -->
  <div
    class="sidebar-logo bg-lightglass border-bottom border-glass
    justify-content-lg-center">
    <a
      href="javascript:void(0);"
      class="text-light nav-link ml-3 mr-5 d-lg-none d-block"
      on:click={onMobileSideBarCollapseClick}>
      <Icon data={faBars}/>
    </a>
    <img alt="Pano" src={basePath() + 'assets/img/logo.svg'} width="20"/>
  </div>

  <div class="sidebar-inner bg-primary">

    <!-- Sidebar Head Website -->
  <div class="sidebar-head">
    <div class="sidebar-icon">
      <img
        alt="Server İkon"
        class="rounded-circle"
        height="64"
        src="http://icons.iconarchive.com/icons/ampeross/lamond/256/minecraft-icon.png"
        width="64"/>
    </div>

    <!-- Sidebar Title Website -->
    <h5 class="text-white">Panocraft</h5>
      {#if $sidebarTabsState === "website"}
        <a
          href="/"
          class="z-1"
          target="_blank">
          <button class="btn btn-secondary btn-sm" type="button">
            Websiteyi Görüntüle
          </button>
        </a>
      {/if}

      {#if $sidebarTabsState === "game"}
        <a
          href="javascript:void(0);"
          class="z-1">
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
    <nav class="sidebar-tab py-2">
      <ul class="management-tab nav nav-pills nav-fill lex-row flex-nowrap">
        <li class="nav-item">
          <!--          :class="{ 'active': sidebarTabsState === 'website', 'text-light': sidebarTabsState !== 'website' }"-->
          <a href="javascript:void(0)" class="nav-link" on:click={onWebsiteMenuClick}
             class:active={$sidebarTabsState === "website"} class:text-light={$sidebarTabsState !== "website"}>
            <Icon data={faGlobe} scale="1.3"/>
          </a>
        </li>
        <li class="nav-item">
          <!--          :class="{ 'active': sidebarTabsState === 'game', 'text-light': sidebarTabsState !== 'game' }"-->
          <a href="javascript:void(0)" class="nav-link" on:click={onGameMenuClick}
             class:active={$sidebarTabsState === "game"} class:text-light={$sidebarTabsState !== "game"}>
            <Icon data={faCube} scale="1.3"/>
          </a>
        </li>
      </ul>
    </nav>

    <!-- Sidebar Site Navigation Menu || Sidebar Server Navigation Menu -->
    <svelte:component this={menuComponent}/>
  </div>

  <!-- Sidebar Bottom -->
  <Bottom/>
</aside>
