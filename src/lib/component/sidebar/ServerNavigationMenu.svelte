<nav class="sidebar-nav navbar-dark" v-if="sidebarTabsState === 'game'">
  <div class="container text-center animate__animated animate__zoomIn">
    <i class="fas fa-cube mx-2 fa-3x m-3 text-light text-opacity-25"></i>

    <p class="text-gray">
      Bağlı sunucu yok. Sunucu menüsünü görebilmek için sunucu bağlayın.
    </p>

    <button
      class="btn bg-lightprimary text-primary btn-sm"
      data-target="#connectServer"
      data-toggle="modal"
      type="button"
    >
      <i class="fas fa-plus mr-1"></i>
      Sunucu Bağla
    </button>
  </div>
</nav>

<script>
  import { base } from "$app/paths";
</script>
