<script>
  import { isPageInitialized } from "../../Store";
  import ConfirmDeleteThemeModal from "../../components/modals/ConfirmDeleteThemeModal.svelte";

  isPageInitialized.set(true);
</script>

<!-- Themes Sub Page -->
<div class="tab-pane">
  <!-- Themes: Current Themes Sub Title -->
  <section class="row justify-content-between align-items-center">
    <div class="col-6">
      <h3 class="text-muted badge badge-lightprimary panel-subtitle">
        Mevcut Temalar
      </h3>
    </div>
  </section>

  <section class="row">
    <div class="col-lg-4 col-md-6">
      <div class="card shadow selected">
        <img
          alt="Vanilla"
          class="rounded p-2"
          height="auto"
          src="../../assets/img/vanilla.png"
          width="100%" />
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
                disabled>
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
