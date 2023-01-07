<nav class="sidebar-nav navbar-dark animate__animated animate__slideInLeft">
  <ul class="navbar-nav px-3">
    <li class="nav-item p-2">
      <a
        class="nav-link"
        href="{base}/"
        class:active="{matching($page.url.pathname, base)}">
        <i class="fas fa-chart-simple me-2"></i>
        İstatistikler
      </a>
    </li>
    {#if hasPermission(Permissions.MANAGE_POSTS)}
      <li class="nav-item p-2">
        <a
          href="{base}/posts"
          class="nav-link"
          class:active="{matching($page.url.pathname, base + '/posts', true)}">
          <i class="fas fa-pen me-2"></i>
          Yazılar
        </a>
      </li>
    {/if}
    {#if hasPermission(Permissions.MANAGE_TICKETS)}
      <li class="nav-item p-2">
        <a
          class="nav-link"
          href="{base}/tickets"
          class:active="{matching(
            $page.url.pathname,
            base + '/tickets',
            true
          )}">
          <i class="fas fa-ticket me-2"></i>
          Talepler
        </a>
      </li>
    {/if}

    <li class="nav-item p-2">
      <a
        class="nav-link"
        href="{base}/players"
        class:active="{matching($page.url.pathname, base + '/players', true)}">
        <i class="fas fa-users me-2"></i>
        Oyuncular
      </a>
    </li>

    {#if hasPermission(Permissions.MANAGE_VIEW)}
      <li class="nav-item p-2">
        <a
          class="nav-link"
          href="{base}/view"
          class:active="{matching($page.url.pathname, base + '/view', true)}">
          <i class="fas fa-palette me-2"></i>
          Görünüm
        </a>
      </li>
    {/if}

    <li class="nav-item p-2">
      <a
        class="nav-link"
        href="{base}/addons"
        class:active="{matching($page.url.pathname, base + '/addons', true)}">
        <i class="fas fa-puzzle-piece me-2"></i>
        Eklentiler
      </a>
    </li>

    <li class="nav-item p-2">
      <a
        class="nav-link"
        href="{base}/settings"
        class:active="{matching($page.url.pathname, base + '/settings', true)}">
        <i class="fas fa-cog me-2"></i>
        Ayarlar
      </a>
    </li>
  </ul>
</nav>

<script>
  import { base } from "$app/paths";
  import { page } from "$app/stores";
  import { hasPermission, Permissions } from "$lib/auth.util.js";

  function matching(path, pathName, startsWith = false) {
    return (
      path.toUpperCase() === pathName.toUpperCase() ||
      path.toUpperCase() === (pathName + "/").toUpperCase() ||
      (startsWith && path.startsWith(pathName))
    );
  }
</script>
