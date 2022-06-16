<nav class="sidebar-nav navbar-dark" v-if="sidebarTabsState === 'game'">
  <div class="container text-center animate__animated animate__zoomIn">
    <i class="fas fa-cube mx-2 fa-3x m-3 text-light text-opacity-25"></i>

    <p class="text-gray">
      Bağlı sunucu yok. Sunucu menüsünü görebilmek için sunucu bağlayın.
    </p>

    <button
      class="btn btn-white text-primary btn-sm"
      data-bs-target="#connectServer"
      data-bs-toggle="modal"
      type="button">
      <i class="fas fa-plus"></i>
      Sunucu Bağla
    </button>
  </div>
</nav>

<script>
  import { base } from "$app/paths";
</script>
