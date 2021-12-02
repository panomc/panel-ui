<nav
  class="sidebar-nav navbar-dark animate__animated animate__slideInLeft"
  v-if="sidebarTabsState === 'website'">
  <ul class="menu navbar-nav font-weight-normal">
    <li class="nav-item" class:active="{matching($page.path, base)}">
      <a class="nav-link" href="{base}/">
        <i class="fas fa-chart-line mx-2"></i>
        İstatistikler
      </a>
    </li>

    <li
      class="nav-item"
      class:active="{matching($page.path, base + '/posts', true)}">
      <a class="nav-link" href="{base}/posts">
        <i class="fas fa-sticky-note mx-2"></i>
        Yazılar
      </a>
    </li>

    <li
      class="nav-item"
      class:active="{matching($page.path, base + '/tickets', true)}">
      <a class="nav-link" href="{base}/tickets">
        <i class="fas fa-ticket-alt mx-2"></i>
        Talepler
      </a>
    </li>

    <li
      class="nav-item"
      class:active="{matching($page.path, base + '/players', true)}">
      <a class="nav-link" href="{base}/players">
        <i class="fas fa-users mx-2"></i>
        Oyuncular
      </a>
    </li>

    <li
      class="nav-item"
      class:active="{matching($page.path, base + '/addons', true)}">
      <a class="nav-link" href="{base}/addons">
        <i class="fas fa-puzzle-piece mx-2"></i>
        Eklentiler
      </a>
    </li>

    <li
      class="nav-item"
      class:active="{matching($page.path, base + '/view', true)}">
      <a class="nav-link" href="{base}/view">
        <i class="fas fa-palette mx-2"></i>
        Görünüm
      </a>
    </li>

    <li
      class="nav-item"
      class:active="{matching($page.path, base + '/tools', true)}">
      <a class="nav-link" href="{base}/tools">
        <i class="fas fa-tools mx-2"></i>
        Araçlar
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
