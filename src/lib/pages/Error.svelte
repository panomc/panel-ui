<!-- 404 Page  -->
<div class="container">
  <div
    class="d-flex flex-column align-items-center justify-content-center mt-5
    container animated bounceInDown">
    <img
      alt="{$_('pages.error.title', { values: { status: $page.status } })}"
      class="img-fluid mb-3"
      src="{base}/assets/img/404.png"
      width="280" />
    <p>
      {$_("page-error." + $page.status) || $page.error.message}
    </p>
    <a class="btn btn-primary" role="button" href="../../.."
      >{$_("pages.error.go-back")}</a>
  </div>
</div>

<script>
  import { getContext } from "svelte";
  import { _ } from "svelte-i18n";

  import { page } from "$app/stores";
  import { base } from "$app/paths";

  const pageTitle = getContext("pageTitle");

  pageTitle.set($_("pages.error.title", { values: { status: $page.status } }));
</script>
