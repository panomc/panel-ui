<nav class="sidebar-nav navbar-dark">
  <div class="container text-center animate__animated animate__zoomIn">
    {#if $selectedServer}
      Seçilmiş olan sunucu: {$selectedServer.name}
    {:else}
      <i class="fas fa-cube mx-2 fa-3x m-3 text-light text-opacity-25"></i>

      <p class="text-gray">
        Bağlı sunucu yok. Sunucu menüsünü görebilmek için sunucu bağlayın.
      </p>

      <button
        class="btn btn-secondary btn-sm"
        data-bs-target="#connectServer"
        data-bs-toggle="modal"
        type="button">
        <i class="fa-solid fa-plus me-2"></i>
        Sunucu Bağla
      </button>
    {/if}
  </div>
</nav>

<script>
  import { selectedServer } from "$lib/Store.js";
</script>
