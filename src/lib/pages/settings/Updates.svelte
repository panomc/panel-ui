<!-- Updates Sub Page -->
<div class="tab-pane">
  <div>
    <!-- Action Menu -->
    <section
      class="row justify-content-between align-items-center mb-3 animate__animated animate__slideInUp"
    >
      <div class="col-auto">
        <strong class="animate__animated animate__zoomIn"
          >2 Güncelleme Mevcut</strong
        >
      </div>
      <div class="col-auto">
        <button class="btn btn-outline-primary" type="button">
          <i class="fas fa-sync"></i>
          <span class="ms-2 d-md-inline d-none">Güncellemeleri Denetle</span>
        </button>
      </div>
    </section>

    <!-- Available Updates -->
    <div class="card">
      <div class="card-body animate__animated animate__fadeIn">
        <h5 class="card-title">Update</h5>
        <p>Lorem, ipsum dolor sit amet consectetur adipisicing elit.</p>
        <button class="btn btn-secondary" type="button">
          <i class="fa fa-download me-2"></i>
          Kur
        </button>
        <button class="btn btn-outline-primary" type="button">
          Değişiklikler
        </button>
      </div>
    </div>
  </div>
</div>

<script>
  import { pageTitle } from "$lib/store.js";

  pageTitle.set("Güncellemeler");
</script>
