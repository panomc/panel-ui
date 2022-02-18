<!-- Settings Contents -->
<article class="container">
  <!-- Settings Categories Nav -->
  <nav>
    <div class="nav nav-pills d-flex justify-content-center flex-row w-100">
      <a
        class="nav-item nav-link"
        href="{base}/settings"
        class:active="{matching($page.path, base + '/settings')}"
      >
        Genel
      </a>
      <a
        class="nav-item nav-link"
        href="{base}/settings/site-settings"
        class:active="{matching(
          $page.path,
          base + '/settings/site-settings',
          true
        )}"
      >
        Website
      </a>
      <a
        class="nav-item nav-link border position-relative"
        href="{base}/settings/updates"
        class:active="{matching($page.path, base + '/settings/updates', true)}"
      >
        Güncellemeler
        <span
          class="position-absolute top-0 start-100 translate-middle p-2 bg-danger border border-light rounded-circle"
        >
          <span class="visually-hidden">New alerts</span>
        </span>
      </a>
      <a
        class="nav-item nav-link"
        href="{base}/settings/about"
        class:active="{matching($page.path, base + '/settings/about', true)}"
      >
        Hakkında
      </a>
    </div>
  </nav>

  <hr />

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
