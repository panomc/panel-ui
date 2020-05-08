<script>
  import { isPageInitialized } from "../Store";

  isPageInitialized.set(true);
</script>

<!-- 404 Page  -->
<div class="content">
  <div
    class="d-flex flex-column align-items-center justify-content-center mt-5
    container animated bounceInDown"
  >
    <img
      alt="Hata: 404"
      class="img-fluid mb-3"
      src="/assets/img/404.png"
      width="280"
    />
    <div class="card-body bg-lightprimary rounded">
      <h2 class="text-primary">Hata: 404</h2>
      <p class="text-muted">
        Yaramaz Enderman, bu sayfanın yüklenmesini engelledi.
      </p>
      <a class="btn btn-primary" role="button" href="./">Geri Git</a>
    </div>
  </div>
</div>
