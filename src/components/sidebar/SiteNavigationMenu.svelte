<script>
  import { path } from "routve";

  import Icon from "svelte-awesome";
  import {
    faChartLine,
    faUsers,
    faPuzzlePiece,
    faPalette,
    faUserCircle,
    faTools,
    faStickyNote,
    faTicketAlt,
  } from "@fortawesome/free-solid-svg-icons";

  function matching(path, pathName, startsWith = false) {
    return (
      path.toUpperCase() === pathName.toUpperCase() ||
      path.toUpperCase() === (pathName + "/").toUpperCase() ||
      (startsWith && path.startsWith(pathName))
    );
  }
</script>

<nav class="sidebar-nav navbar-light" v-if="sidebarTabsState === 'website'">
  <ul class="menu navbar-nav font-weight-normal">
    <li class="nav-item" class:active="{matching($path, '/panel')}">
      <a class="nav-link" href="/panel">
        <Icon data="{faChartLine}" class="mx-2" />
        İstatistikler
      </a>
    </li>

    <li class="nav-item" class:active="{matching($path, '/panel/posts', true)}">
      <a class="nav-link" href="/panel/posts">
        <Icon data="{faStickyNote}" class="mx-2" />
        Yazılar
      </a>
    </li>

    <li
      class="nav-item"
      class:active="{matching($path, '/panel/tickets', true)}"
    >
      <a class="nav-link" href="/panel/tickets">
        <Icon data="{faTicketAlt}" class="mx-2" />
        Talepler
      </a>
    </li>

    <li
      class="nav-item"
      class:active="{matching($path, '/panel/players', true)}"
    >
      <a class="nav-link" href="/panel/players">
        <Icon data="{faUsers}" class="mx-2" />
        Oyuncular
      </a>
    </li>

    <li
      class="nav-item"
      class:active="{matching($path, '/panel/addons', true)}"
    >
      <a class="nav-link" href="/panel/addons">
        <Icon data="{faPuzzlePiece}" class="mx-2" />
        Eklentiler
      </a>
    </li>

    <li class="nav-item" class:active="{matching($path, '/panel/view', true)}">
      <a class="nav-link" href="/panel/view">
        <Icon data="{faPalette}" class="mx-2" />
        Görünüm
      </a>
    </li>

    <li
      class="nav-item"
      class:active="{matching($path, '/panel/admins', true)}"
    >
      <a class="nav-link" href="/panel/admins">
        <Icon data="{faUserCircle}" class="mx-2" />
        Yöneticiler
      </a>
    </li>

    <li class="nav-item" class:active="{matching($path, '/panel/tools', true)}">
      <a class="nav-link" href="/panel/tools">
        <Icon data="{faTools}" class="mx-2" />
        Araçlar
      </a>
    </li>
  </ul>
</nav>
