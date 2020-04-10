<script>
  import Icon from "svelte-awesome";
  import {
    faChartLine,
    faUsers,
    faPuzzlePiece,
    faPalette,
    faUserCircle,
    faTools
  } from "@fortawesome/free-solid-svg-icons";
</script>

<nav class="sidebar-nav navbar-dark" v-if="sidebarTabsState === 'website'">
  <ul class="menu navbar-nav font-weight-normal">
    <!--        :class="{ 'active': path === '/panel' || path === '/panel/' }"-->
    <li class="nav-item">
      <router-link class="nav-link" to="/panel">
        <Icon data={faChartLine} class="mr-1"/>
        İstatistikler
      </router-link>
    </li>
    <!--        :class="{ 'active': path.startsWith('/panel/players') }"-->
    <li class="nav-item">
      <router-link class="nav-link" to="/panel/players">
        <Icon data={faUsers} class="mr-1"/>
        Oyuncular
      </router-link>
    </li>
    <!--        :class="{ 'active': path.startsWith('/panel/addons') }"-->
    <li class="nav-item">
      <router-link class="nav-link" to="/panel/addons">
        <Icon data={faPuzzlePiece} class="mr-1"/>
        Eklentiler
      </router-link>
    </li>
    <!--        :class="{ 'active': path.startsWith('/panel/view') }"-->
    <li class="nav-item">
      <router-link class="nav-link" to="/panel/view">
        <Icon data={faPalette} class="mr-1"/>
        Görünüm
      </router-link>
    </li>
    <!--        :class="{ 'active': path.startsWith('/panel/admins') }"-->
    <li class="nav-item">
      <router-link class="nav-link" to="/panel/admins">
        <Icon data={faUserCircle} class="mr-1"/>
        Yöneticiler
      </router-link>
    </li>
    <!--        :class="{ 'active': path.startsWith('/panel/tools') }"-->
    <li class="nav-item">
      <router-link class="nav-link" to="/panel/tools">
        <Icon data={faTools} class="mr-1"/>
        Araçlar
      </router-link>
    </li>
  </ul>
</nav>
