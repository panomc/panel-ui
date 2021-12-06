<svelte:head>
  <title>{getTitle("Temalar")}</title>
</svelte:head>

<!-- Themes Sub Page -->
<div class="tab-pane">
  <!-- Themes: Current Themes Sub Title -->
  <section class="row justify-content-between align-items-center">
    <div class="col-6"></div>
    <div class="col-6 text-right"></div>
  </section>

  <section class="row">
    <div class="col-lg-4 col-md-6">
      <div class="card shadow selected animate__animated animate__zoomIn">
        <img
          alt="Vanilla"
          class="rounded p-2"
          height="auto"
          src="{base}/assets/img/vanilla.png"
          width="100%"
        />
        <div class="card-body">
          <div class="row justify-content-between align-items-center">
            <div class="col-6 text-left">
              <h5 class="card-title mb-0">Vanilla</h5>
              Yapımcı: Butlu
            </div>
            <div class="col-6 text-right">
              <button
                class="btn btn-outline-danger btn-sm disabled"
                data-target="#confirmDeleteTheme"
                data-toggle="modal"
                disabled
              >
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

  import { getTitle } from "$lib/title.util";

  import ConfirmDeleteThemeModal from "$lib/component/modals/ConfirmDeleteThemeModal.svelte";
</script>
