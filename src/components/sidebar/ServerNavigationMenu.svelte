<script>
  import Icon from "svelte-awesome";
  import {
    faTachometerAlt,
    faCogs,
    faCube,
    faPlus
  } from "@fortawesome/free-solid-svg-icons";
</script>

<nav class="sidebar-nav navbar-dark" v-if="sidebarTabsState === 'game'">
  <ul class="menu navbar-nav font-weight-normal">
    <!--        :class="{ 'active': path.startsWith('/panel/server-panel') }"-->
    <li class="nav-item">
      <router-link class="nav-link" to="/panel/tools">
        <Icon data={faTachometerAlt} class="mr-1"/>
        Sunucu Durumu
      </router-link>
    </li>
    <!--        :class="{ 'active': path.startsWith('/panel/server-preferences') }"-->
    <li class="nav-item">
      <router-link class="nav-link" to="/panel/tools">
        <Icon data={faCogs} class="mr-1"/>
        Konfigürasyon
      </router-link>
    </li>
  </ul>
  <div class="container text-center">
    <Icon data={faCube} scale="3" class="m-3 text-lightglass"/>
    <p class="text-gray">
      Bağlı sunucu yok. Sunucu yönetimi menüsünü getirmek için bir sunucu
      bağlayın.
    </p>
    <button
      class="btn btn-secondary btn-sm"
      data-target="#connectServer"
      data-toggle="modal"
      type="button">
      <Icon data={faPlus} class="mr-1"/>
      Suncuu Bağla
    </button>
  </div>
</nav>