<nav class="sidebar-nav navbar-dark animate__animated animate__slideInRight">
  {#if $selectedServer}
    <ul class="navbar-nav px-3">
      <li class="nav-item p-2">
        <a
          class="nav-link"
          href="{base}/server/dashboard"
          class:active="{matching(
            $page.url.pathname,
            base + '/server/dashboard'
          )}">
          <i class="fas fa-chart-pie me-2"></i>
          İstatistikler
        </a>
      </li>
      <li class="nav-item p-2">
        <a
          class="nav-link"
          href="{base}/server/settings"
          class:active="{matching(
            $page.url.pathname,
            base + '/server/settings',
            true
          )}">
          <i class="fas fa-cog me-2"></i>
          Ayarlar
        </a>
      </li>
    </ul>
  {:else if $connectedServerCount > 0}
    <NoContent
      icon="fas fa-cube fa-3x"
      text="Seçili sunucu yok."
      dark="{true}" />
  {:else}
    <NoContent
      icon="fas fa-cube fa-3x"
      text="Bağlı sunucu yok. Sunucu menüsünü görebilmek için sunucu bağlayın."
      dark="{true}">
      <button
        class="btn btn-secondary btn-sm"
        data-bs-target="#connectServer"
        data-bs-toggle="modal"
        type="button">
        <i class="fa-solid fa-plus me-2"></i>
        Sunucu Bağla
      </button>
    </NoContent>
  {/if}
</nav>

<script>
  import { getContext } from "svelte";

  import { base } from "$app/paths";
  import { page } from "$app/stores";

  import NoContent from "$lib/component/NoContent.svelte";

  import { show as showServersModal } from "$lib/component/modals/ServersModal.svelte";

  const selectedServer = getContext("selectedServer");
  const connectedServerCount = getContext("connectedServerCount");

  function matching(path, pathName, startsWith = false) {
    return (
      path.toUpperCase() === pathName.toUpperCase() ||
      path.toUpperCase() === (pathName + "/").toUpperCase() ||
      (startsWith && path.startsWith(pathName))
    );
  }
</script>
