<script>
  import { basePath } from "../util/path.util";
  import Icon from "svelte-awesome";
  import {
    faBars,
    faGlobe,
    faCube,
    faChartLine,
    faPuzzlePiece,
    faUsers,
    faPalette,
    faTools,
    faUserCircle,
    faPlus,
    faCogs,
    faTachometerAlt,
    faCog,
    faSync,
    faQuestion
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
      <Icon data={faBars} />
    </a>
    <img alt="Pano" src={basePath() + 'assets/img/logo.svg'} width="20" />
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
          width="64" />
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
            <Icon data={faGlobe} scale="1.3" />
          </a>
        </li>
        <li class="nav-item">
          <!--          :class="{ 'active': sidebarTabsState === 'game', 'text-light': sidebarTabsState !== 'game' }"-->
          <!--          @click="onGameClick" class="nav-link" href="javascript:void(0)"-->
          <a class="nav-link text-light" href="javascript:void(0);">
            <Icon data={faCube} scale="1.3" />
          </a>
        </li>
      </ul>
    </nav>

    <!-- Sidebar Site Navigation Menu -->
    <nav class="sidebar-nav navbar-dark" v-if="sidebarTabsState === 'website'">
      <ul class="menu navbar-nav font-weight-normal">
        <!--        :class="{ 'active': path === '/panel' || path === '/panel/' }"-->
        <li class="nav-item">
          <router-link class="nav-link" to="/panel">
            <Icon data={faChartLine} class="mr-1" />
            İstatistikler
          </router-link>
        </li>
        <!--        :class="{ 'active': path.startsWith('/panel/players') }"-->
        <li class="nav-item">
          <router-link class="nav-link" to="/panel/players">
            <Icon data={faUsers} class="mr-1" />
            Oyuncular
          </router-link>
        </li>
        <!--        :class="{ 'active': path.startsWith('/panel/addons') }"-->
        <li class="nav-item">
          <router-link class="nav-link" to="/panel/addons">
            <Icon data={faPuzzlePiece} class="mr-1" />
            Eklentiler
          </router-link>
        </li>
        <!--        :class="{ 'active': path.startsWith('/panel/view') }"-->
        <li class="nav-item">
          <router-link class="nav-link" to="/panel/view">
            <Icon data={faPalette} class="mr-1" />
            Görünüm
          </router-link>
        </li>
        <!--        :class="{ 'active': path.startsWith('/panel/admins') }"-->
        <li class="nav-item">
          <router-link class="nav-link" to="/panel/admins">
            <Icon data={faUserCircle} class="mr-1" />
            Yöneticiler
          </router-link>
        </li>
        <!--        :class="{ 'active': path.startsWith('/panel/tools') }"-->
        <li class="nav-item">
          <router-link class="nav-link" to="/panel/tools">
            <Icon data={faTools} class="mr-1" />
            Araçlar
          </router-link>
        </li>
      </ul>
    </nav>

    <!-- Sidebar Server Navigation Menu -->
    <nav class="sidebar-nav navbar-dark" v-if="sidebarTabsState === 'game'">
      <ul class="menu navbar-nav font-weight-normal">
        <!--        :class="{ 'active': path.startsWith('/panel/server-panel') }"-->
        <li class="nav-item">
          <router-link class="nav-link" to="/panel/tools">
            <Icon data={faTachometerAlt} class="mr-1" />
            Sunucu Durumu
          </router-link>
        </li>
        <!--        :class="{ 'active': path.startsWith('/panel/server-preferences') }"-->
        <li class="nav-item">
          <router-link class="nav-link" to="/panel/tools">
            <Icon data={faCogs} class="mr-1" />
            Konfigürasyon
          </router-link>
        </li>
      </ul>
      <div class="container text-center">
        <Icon data={faCube} scale="3" class="m-3 text-lightglass" />
        <p class="text-gray">
          Bağlı sunucu yok. Sunucu yönetimi menüsünü getirmek için bir sunucu
          bağlayın.
        </p>
        <button
          class="btn btn-secondary btn-sm"
          data-target="#connectServer"
          data-toggle="modal"
          type="button">
          <Icon data={faPlus} class="mr-1" />
          Suncuu Bağla
        </button>
      </div>
    </nav>

  </div>

  <!-- Sidebar Bottom -->
  <div
    class="sidebar-bottom px-2 py-2 w-100 d-flex align-items-center
    justify-content-between bg-primary border-top border-right border-glass">
    <router-link
      class="btn btn-link text-light"
      to="/panel/settings"
      v-tooltip:top="'Ayarlar'">
      <Icon data={faCog} />
    </router-link>
    <router-link
      class="btn btn-link text-light"
      to="/panel/settings/updates"
      v-tooltip:top="'Güncellemeler'">
      <Icon data={faSync} />
    </router-link>
    <a
      class="btn btn-link text-light"
      href="https://panomc.com/discord"
      target="_blank"
      v-tooltip:top="'Yardım'">
      <Icon data={faQuestion} />
    </a>
  </div>
</aside>
