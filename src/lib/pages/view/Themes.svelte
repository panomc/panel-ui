<!-- Themes Sub Page -->
<div class="tab-pane">
  <!-- Themes: Current Themes Sub Title -->
  <section class="row">
    <div class="col-lg-4 col-md-6">
      <div class="card selected animate__animated animate__fadeIn">
        <img
          alt="Vanilla"
          class="rounded p-2"
          height="auto"
          src="{base}/assets/img/vanilla.png"
          width="100%" />
        <div class="card-body">
          <div class="row justify-content-between align-items-end">
            <div class="col-auto">
              <h5 class="card-title mb-0">Vanilla</h5>
              Yapımcı: Butlu
            </div>
            <div class="col-auto">
              <button
                class="btn btn-outline-danger btn-sm"
                data-bs-target="#confirmDeleteTheme"
                data-bs-toggle="modal">
                Kaldır
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <ConfirmDeleteThemeModal />
</div>

<script>
  import { base } from "$app/paths";
  import { page } from "$app/stores";

  import ConfirmDeleteThemeModal from "$lib/component/modals/ConfirmDeleteThemeModal.svelte";

  const { pageTitle } = $page.data;

  pageTitle.set("Temalar");
</script>
