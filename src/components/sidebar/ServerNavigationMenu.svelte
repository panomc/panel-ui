<nav class="sidebar-nav navbar-dark" v-if="sidebarTabsState === 'game'">
  <ul
    class="menu navbar-nav font-weight-normal d-none animate__animated animate__slideInRight"
  >
    <!--        :class="{ 'active': path.startsWith('{base}/server-panel') }"-->
    <li class="nav-item">
      <a class="nav-link" href="{base}/tools">
        <i class="fas fa-tachometer-alt mx-2"></i>
        Sunucu Durumu
      </a>
    </li>
    <!--        :class="{ 'active': path.startsWith('{base}/server-preferences') }"-->
    <li class="nav-item">
      <a class="nav-link" href="{base}/tools">
        <i class="fas fa-cogs mx-2"></i>
        Konfigürasyon
      </a>
    </li>
  </ul>
  <div
    class="container text-center animate__animated animate__headShake animate__slower"
  >
    <i class="fas fa-cube mx-2 fa-3x m-3 text-glass"></i>

    <p class="text-gray">
      Bağlı sunucu yok. Sunucu yönetimi menüsünü getirmek için bir sunucu
      bağlayın.
    </p>

    <button
      class="btn bg-lightprimary text-primary btn-sm"
      data-target="#connectServer"
      data-toggle="modal"
      type="button"
    >
      <i class="fas fa-plus mr-2"></i>
      Sunucu Bağla
    </button>
  </div>
</nav>

<script>
  import { base } from "$app/paths";
</script>
