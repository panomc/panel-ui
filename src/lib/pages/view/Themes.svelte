<!-- Theme Settings -->
<div class="card col-4 bg-white animate__animated animate__fadeIn">
  <img alt="Vanilla" class="card-img-top" src="{base}/assets/img/vanilla.png" />
  <div class="card-body">
    <h5 class="card-title mb-0">Vanilla</h5>
    <p class="card-text">
      <small class="text-muted">Yapımcı: Butlu</small>
    </p>
  </div>
</div>

<ConfirmDeleteThemeModal />

<script>
  import { getContext } from "svelte";

  import { base } from "$app/paths";

  import ConfirmDeleteThemeModal from "$lib/component/modals/ConfirmDeleteThemeModal.svelte";

  const pageTitle = getContext("pageTitle");

  pageTitle.set("Temalar");
</script>
