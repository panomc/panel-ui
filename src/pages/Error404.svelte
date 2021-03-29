<!-- 404 Page  -->
<div class="container">
  <div
    class="d-flex flex-column align-items-center justify-content-center mt-5
    container animated bounceInDown">
    <img
      alt="Hata: 404"
      class="img-fluid mb-3"
      src="/assets/img/404.png"
      width="280" />
    <h2>Hata: 404</h2>
    <p class="text-muted">
      Yaramaz Enderman, bu sayfanın yüklenmesini engelledi.
    </p>
    <a class="btn btn-primary" role="button" href="./">Geri Git</a>
  </div>
</div>

<script>
  import { isPageInitialized } from "../Store";

  isPageInitialized.set(true);
</script>
