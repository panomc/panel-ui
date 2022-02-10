<!-- View Page -->

<!-- View Page Contents -->
<article class="container">
  <!-- View Categories Navigation -->
  <nav>
    <div class="nav nav-pills d-flex flex-row w-100 mb-3">
      <a
        class="nav-item nav-link"
        href="{base}/view"
        class:active="{matching($page.path, base + '/view')}">
        Temalar
      </a>
      <a
        class="nav-item nav-link"
        href="{base}/view/theme-options"
        class:active="{matching($page.path, base + '/view/theme-options')}">
        Tema Seçenekleri
      </a>
    </div>
  </nav>

  <slot />
</article>

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
