<!-- Settings Contents -->
<div class="container">
  <div class="row justify-content-around">
    <div class="col-auto">
      <!-- Settings Nav -->
      <div
        class="nav nav-pills d-flex flex-row justify-content-center mb-3 w-100">
        <a
          class="nav-item nav-link"
          href="{base}/settings"
          class:active="{matching($page.url.pathname, base + '/settings')}">
          Genel
        </a>
        <a
          class="nav-item nav-link"
          href="{base}/settings/site-settings"
          class:active="{matching(
            $page.url.pathname,
            base + '/settings/site-settings',
            true
          )}">
          Website
        </a>
        <a
          class="nav-item nav-link position-relative"
          href="{base}/settings/updates"
          class:active="{matching(
            $page.url.pathname,
            base + '/settings/updates',
            true
          )}">
          Güncellemeler
          <span
            class="position-absolute top-0 start-100 translate-middle p-2 bg-danger rounded-circle">
          </span>
        </a>
        <a
          class="nav-item nav-link"
          href="{base}/settings/about"
          class:active="{matching(
            $page.url.pathname,
            base + '/settings/about',
            true
          )}">
          Hakkında
        </a>
      </div>
    </div>
  </div>

  <slot />
</div>

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
