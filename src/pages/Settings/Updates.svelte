<script>
  import { isPageInitialized } from "../../Store";
  import { onMount } from "svelte";

  import Icon from "svelte-awesome";
  import { faSync, faDownload } from "@fortawesome/free-solid-svg-icons";

  onMount(() => {
    isPageInitialized.set(true);
  });
</script>

<!-- Updates Sub Page -->
<div class="tab-pane">
  <div>
    <!-- Action Menu -->
    <section class="row justify-content-between align-items-center mb-3">
      <div class="col-md-4 d-flex align-items-center">
        <strong class="text-primary mx-2">2 Güncelleme Mevcut</strong>
      </div>
      <div class="col text-right">
        <button class="btn btn-outline-primary" type="button">
          <Icon data="{faSync}" />
        </button>
      </div>
    </section>

    <!-- Available Updates -->
    <div class="card">
      <div class="card-body position-relative">
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
          <Icon data="{faDownload}" class="mr-1" />
          Kur
        </button>
        <button class="btn btn-outline-primary" type="button">
          Değişiklikler
        </button>
      </div>
    </div>

    <div class="card">
      <div class="card-body position-relative">
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
          <Icon data="{faDownload}" class="mr-1" />
          Kur
        </button>
        <button class="btn btn-outline-primary" type="button">
          Değişiklikler
        </button>
      </div>
    </div>
  </div>
</div>
