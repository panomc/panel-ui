<!-- Server Settings Contents -->
<div class="container">
  <div class="row justify-content-around">
    <div class="col-auto">
      <!-- Server Settings Nav -->
      <div
        class="nav nav-pills d-flex flex-row justify-content-center mb-3 w-100">
        <a
          class="nav-item nav-link"
          href="{base}/server/settings"
          class:active="{matching(
            $page.url.pathname,
            base + '/server/settings'
          )}">
          Sunucu
        </a>
        <a
          class="nav-item nav-link"
          href="{base}/server/settings/game-integration"
          class:active="{matching(
            $page.url.pathname,
            base + '/server/settings/game-integration',
            true
          )}">
          Oyun Entegrasyonu
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
