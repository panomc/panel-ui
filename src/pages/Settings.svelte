<!-- Settings Contents -->
<article class="container">
  <!-- Settings Categories Nav -->
  <nav>
    <div class="nav nav-pills d-flex justify-content-center flex-row w-100">
      <a
        class="nav-item nav-link"
        href="/panel/settings"
        class:active="{matching($path, '/panel/settings')}">
        Genel
      </a>
      <a
        class="nav-item nav-link"
        href="/panel/settings/site-settings"
        class:active="{matching($path, '/panel/settings/site-settings', true)}">
        Website
      </a>
      <a
        class="nav-item nav-link ml-sm-auto position-relative"
        href="/panel/settings/updates"
        class:active="{matching($path, '/panel/settings/updates', true)}">
        Güncellemeler
        <span class="notification"></span>
      </a>
      <a
        class="nav-item nav-link"
        href="/panel/settings/about"
        class:active="{matching($path, '/panel/settings/about', true)}">
        Hakkında
      </a>
    </div>
  </nav>
  <hr />
  <Router />
</article>

<script>
  import Router, { path } from "routve";

  function matching(path, pathName, startsWith = false) {
    return (
      path.toUpperCase() === pathName.toUpperCase() ||
      path.toUpperCase() === (pathName + "/").toUpperCase() ||
      (startsWith && path.startsWith(pathName))
    );
  }
</script>
