<script>
  import { path } from "../../RouterStore";

  import Icon from "svelte-awesome";
  import {
    faChartLine,
    faUsers,
    faPuzzlePiece,
    faPalette,
    faUserCircle,
    faTools
  } from "@fortawesome/free-solid-svg-icons";

  function matching(path, pathName, startsWith = false) {
    return (
      path.toUpperCase() === pathName.toUpperCase() ||
      path.toUpperCase() === (pathName + "/").toUpperCase() ||
      (startsWith && path.startsWith(pathName))
    );
  }
</script>

<nav class="sidebar-nav navbar-dark" v-if="sidebarTabsState === 'website'">
  <ul class="menu navbar-nav font-weight-normal">
    <li class="nav-item" class:active={matching($path, '/panel')}>
      <a class="nav-link" href="/panel">
        <Icon data={faChartLine} class="mr-1" />
        İstatistikler
      </a>
    </li>

    <li class="nav-item" class:active={matching($path, '/panel/players', true)}>
      <a class="nav-link" href="/panel/players">
        <Icon data={faUsers} class="mr-1" />
        Oyuncular
      </a>
    </li>

    <li class="nav-item" class:active={matching($path, '/panel/addons', true)}>
      <a class="nav-link" href="/panel/addons">
        <Icon data={faPuzzlePiece} class="mr-1" />
        Eklentiler
      </a>
    </li>

    <li class="nav-item" class:active={matching($path, '/panel/view', true)}>
      <a class="nav-link" href="/panel/view">
        <Icon data={faPalette} class="mr-1" />
        Görünüm
      </a>
    </li>

    <li class="nav-item" class:active={matching($path, '/panel/admins', true)}>
      <a class="nav-link" href="/panel/admins">
        <Icon data={faUserCircle} class="mr-1" />
        Yöneticiler
      </a>
    </li>

    <li class="nav-item" class:active={matching($path, '/panel/tools', true)}>
      <a class="nav-link" href="/panel/tools">
        <Icon data={faTools} class="mr-1" />
        Araçlar
      </a>
    </li>
  </ul>
</nav>
