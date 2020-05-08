<script>
  import Router from "../components/Router.svelte";
  import { path } from "../RouterStore";

  function matching(path, pathName, startsWith = false) {
    return (
      path.toUpperCase() === pathName.toUpperCase() ||
      path.toUpperCase() === (pathName + "/").toUpperCase() ||
      (startsWith && path.startsWith(pathName))
    );
  }
</script>

<!-- View Page -->

<!-- View Categories Navigation -->
<nav class="border-bottom border-glass page-category">
  <div class="nav nav-pills d-flex flex-row w-100">
    <a
      class="nav-item nav-link"
      href="/panel/view"
      class:active="{matching($path, '/panel/view')}"
    >
      Temalar
    </a>

    <a
      class="nav-item nav-link"
      href="/panel/view/theme-options"
      class:active="{matching($path, '/panel/view/theme-options')}"
    >
      Tema Seçenekleri
    </a>
  </div>
</nav>

<!-- Settings Contents -->
<article class="content">
  <Router basePath="/panel/view" />
</article>
