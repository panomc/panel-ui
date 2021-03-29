<!-- View Page -->

<!-- Settings Contents -->
<article class="container">
  <!-- View Categories Navigation -->
  <nav>
    <div class="nav nav-pills d-flex flex-row w-100">
      <a
        class="nav-item nav-link"
        href="/panel/view"
        class:active="{matching($path, '/panel/view')}">
        Temalar
      </a>

      <a
        class="nav-item nav-link"
        href="/panel/view/theme-options"
        class:active="{matching($path, '/panel/view/theme-options')}">
        Tema Seçenekleri
      </a>

      <button class="btn btn-primary ml-auto">
        <Icon data="{faPlus}" class="mr-1" />
        Tema Ekle
      </button>
    </div>
  </nav>

  <hr />

  <Router />
</article>

<script>
  import Router, { path } from "routve";
  import Icon from "svelte-awesome";
  import { faPlus } from "@fortawesome/free-solid-svg-icons";

  function matching(path, pathName, startsWith = false) {
    return (
      path.toUpperCase() === pathName.toUpperCase() ||
      path.toUpperCase() === (pathName + "/").toUpperCase() ||
      (startsWith && path.startsWith(pathName))
    );
  }
</script>
