<!-- Updates Sub Page -->
<div class="tab-pane">
  <div>
    <!-- Action Menu -->
    <section
      class="row justify-content-between align-items-center mb-3 animate__animated animate__slideInUp">
      <div class="col-auto">
        <strong class="mx-2 animate__animated animate__zoomIn"
          >2 Güncelleme Mevcut</strong>
      </div>
      <div class="col-auto">
        <button class="btn btn-outline-primary" type="button">
          <i class="fas fa-sync mr-1"></i> Güncellemeleri Denetle
        </button>
      </div>
    </section>

    <!-- Available Updates -->
    <div class="card">
      <div class="card-body animate__animated animate__fadeIn">
        <h5 class="card-title">Update</h5>
        <small>
          Dosya Boyutu:
          <b>5 MB.</b>
        </small>
        <p>Lorem, ipsum dolor sit amet consectetur adipisicing elit.</p>
        <button class="btn btn-secondary" type="button">
          <i class="fa fa-download mr-1"></i>
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
  import { pageTitle } from "$lib/store";

  pageTitle.set("Güncellemeler");
</script>
