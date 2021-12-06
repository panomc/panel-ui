<script>
  import { getTitle } from "$lib/title.util";
</script>

<svelte:head>
  <title>{getTitle("Güncellemeler")}</title>
</svelte:head>

<!-- Updates Sub Page -->
<div class="tab-pane">
  <div>
    <!-- Action Menu -->
    <section class="row justify-content-between align-items-center mb-3 animate__animated animate__slideInUp">
      <div class="col-md-4 d-flex align-items-center">
        <strong class="mx-2 animate__animated animate__zoomIn"
          >2 Güncelleme Mevcut</strong
        >
      </div>
      <div class="col text-right">
        <button class="btn btn-outline-primary" type="button">
          <i class="fas fa-sync mr-1"></i> Güncellemeleri Denetle
        </button>
      </div>
    </section>

    <!-- Available Updates -->
    <div class="card">
      <div
        class="card-body position-relative animate__animated animate__fadeIn"
      >
        <span class="notification"></span>
        <h5 class="card-title">
          <a href="#">Pano 1.2</a>
        </h5>
        <h6 class="text-muted font-weight-normal">
          Yayınlanma:
          <b>01.01.2019</b>
        </h6>
        <h6 class="text-muted font-weight-normal">
          Dosya Boyutu:
          <b>5 MB.</b>
        </h6>
        <p>
          Pano'nun altyapısını sağlayan çekirdek sistemlerin yeni özelliklerini
          ve mevcut özelliklerinin iyileştirmesini sağlayan önemli
          güncellemelerdir.
        </p>
        <hr />
        <button class="btn btn-secondary" type="button">
          <i class="fas fa-download mr-1"></i>
          Kur
        </button>
        <button class="btn btn-outline-primary" type="button">
          Değişiklikler
        </button>
      </div>
    </div>

    <div class="card">
      <div
        class="card-body position-relative animate__animated animate__fadeIn"
      >
        <span class="notification"></span>
        <h5 class="card-title">
          <a href="#">Sayfalar 1.1</a>
        </h5>
        <h6 class="text-muted font-weight-normal">
          Yayınlanma:
          <b>01.01.2019</b>
        </h6>
        <h6 class="text-muted font-weight-normal">
          Dosya Boyutu:
          <b>5 MB.</b>
        </h6>
        <hr />
        <button class="btn btn-secondary" type="button">
          <i class="fas fa-download mr-1"></i>
          Kur
        </button>
        <button class="btn btn-outline-primary" type="button">
          Değişiklikler
        </button>
      </div>
    </div>
  </div>
</div>
