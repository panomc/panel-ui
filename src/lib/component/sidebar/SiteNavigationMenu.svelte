<nav
  class="sidebar-nav navbar-dark animate__animated animate__slideInLeft"
  v-if="sidebarTabsState === 'website'">
  <ul class="navbar-nav px-3">
    <li
      class="nav-item p-2"
      class:active="{matching($page.url.pathname, base)}">
      <a class="nav-link" href="{base}/">
        <i class="fas fa-chart-pie me-2"></i>
        İstatistikler
      </a>
    </li>

    <li
      class="nav-item p-2"
      class:active="{matching($page.url.pathname, base + '/posts', true)}">
      <a href="{base}/posts" class="nav-link">
        <i class="fas fa-pen me-2"></i>
        Yazılar
      </a>
    </li>
    <li
      class="nav-item p-2"
      class:active="{matching($page.url.pathname, base + '/tickets', true)}">
      <a class="nav-link" href="{base}/tickets">
        <i class="fas fa-ticket me-2"></i>
        Talepler
      </a>
    </li>

    <li
      class="nav-item p-2"
      class:active="{matching($page.url.pathname, base + '/players', true)}">
      <a class="nav-link" href="{base}/players">
        <i class="fas fa-users me-2"></i>
        Oyuncular
      </a>
    </li>

    <li
      class="nav-item p-2"
      class:active="{matching($page.url.pathname, base + '/view', true)}">
      <a class="nav-link" href="{base}/view">
        <i class="fas fa-palette me-2"></i>
        Görünüm
      </a>
    </li>

    <li
      class="nav-item p-2"
      class:active="{matching($page.url.pathname, base + '/addons', true)}">
      <a class="nav-link" href="{base}/addons">
        <i class="fas fa-puzzle-piece me-2"></i>
        Eklentiler
      </a>
    </li>

    <li
      class="nav-item p-2"
      class:active="{matching($page.url.pathname, base + '/settings', true)}">
      <a class="nav-link" href="{base}/settings">
        <i class="fas fa-cog me-2"></i>
        Ayarlar
      </a>
    </li>
  </ul>
</nav>

<script>
  import { base } from "$app/paths";
  import { page } from "$app/stores";

  function matching(path, pathName, startsWith = false) {
    return (
      path.toUpperCase() === pathName.toUpperCase() ||
      path.toUpperCase() === (pathName + "/").toUpperCase() ||
      (startsWith && path.startsWith(pathName))
    );
  }
</script>
