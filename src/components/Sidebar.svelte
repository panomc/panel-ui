<script>
  import {basePath} from "../util/path.util";

  import Bottom from "./sidebar/Bottom.svelte"
  import SiteNavigationMenu from "./sidebar/SiteNavigationMenu.svelte";
  import ServerNavigationMenu from "./sidebar/ServerNavigationMenu.svelte";

  import Icon from "svelte-awesome";
  import {
    faBars,
    faGlobe,
    faCube
  } from "@fortawesome/free-solid-svg-icons";

</script>

<!-- Sidebar -->
<!--:class="{ 'active': isSidebarOpen }"-->
<aside class="active sidebar bg-primary">

  <!-- Sidebar Logo -->
  <div
    class="sidebar-logo bg-lightglass border-bottom border-glass
    justify-content-lg-center">
    <!--    @click="onMobileSideBarCollapseClick"-->
    <a
      href="javascript:void(0);"
      class="text-light nav-link ml-3 mr-5 d-lg-none d-block">
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

      <a
        href="/"
        class="z-1"
        target="_blank"
        v-if="sidebarTabsState === 'website'">
        <button class="btn btn-secondary btn-sm" type="button">
          Websiteyi Görüntüle
        </button>
      </a>

      <!-- <a
        href="javascript:void(0);"
        class="z-1"
        v-if="sidebarTabsState === 'game'">
        <button
          class="btn btn-aqua btn-sm text-white"
          data-target="#showServers"
          data-toggle="modal"
          type="button">
          Sunucuları Görüntüle
        </button>
      </a> -->
    </div>

    <!-- Sidebar Tabs -->
    <nav class="sidebar-tab py-2">
      <ul class="management-tab nav nav-pills nav-fill lex-row flex-nowrap">
        <li class="nav-item">
          <!--          :class="{ 'active': sidebarTabsState === 'website', 'text-light': sidebarTabsState !== 'website' }"-->
          <!--          @click="onWebsiteClick"-->
          <a class="nav-link active" href="javascript:void(0)">
            <Icon data={faGlobe} scale="1.3"/>
          </a>
        </li>
        <li class="nav-item">
          <!--          :class="{ 'active': sidebarTabsState === 'game', 'text-light': sidebarTabsState !== 'game' }"-->
          <!--          @click="onGameClick" class="nav-link" href="javascript:void(0)"-->
          <a class="nav-link text-light" href="javascript:void(0);">
            <Icon data={faCube} scale="1.3"/>
          </a>
        </li>
      </ul>
    </nav>

    <!-- Sidebar Site Navigation Menu -->
    <SiteNavigationMenu/>

    <!-- Sidebar Server Navigation Menu -->
    <ServerNavigationMenu/>
  </div>

  <!-- Sidebar Bottom -->
  <Bottom/>
</aside>
