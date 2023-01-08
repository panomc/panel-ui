<div class="container">

  <div
    class="row justify-content-end mb-3 animate__animated animate__slideInUp">
    <div class="col-auto">
      <a href="#" class="btn btn-link" role="button" 
            use:tooltip="{['Yenile', { placement: 'bottom' }]}">
        <i class="fa-solid fa-sync fa-spin"></i>
        <!-- yenilendiginde fa-spin classi'i ve disabled eklenecek -->
      </a>
    </div>
    <div class="col-auto">
      <a href="#" class="btn btn-secondary ml-auto" role="button">
        <i class="fa-solid fa-house me-2"></i> Ana Sunucu Yap
      </a>
    </div>
</div>
  <div
    class="row justify-content-between mb-3 animate__animated animate__slideInUp">
    <div class="col-4">
      <div class="card bg-transparent">
        <div class="card-body">
          <p
            class="mb-0 lead text-secondary text-center"
            use:tooltip="{['Sunucu', { placement: 'bottom' }]}">
            Çevrimiçi
          </p>
          <p
            class="mb-0 lead text-danger text-center"
            use:tooltip="{['Sunucu', { placement: 'bottom' }]}">
            Çevrimdışı
          </p>
        </div>
      </div>
    </div>
    <div class="col-4">
      <div class="card bg-transparent">
        <div class="card-body">
          <p
            class="mb-0 lead text-primary text-center"
            use:tooltip="{['Sunucu', { placement: 'bottom' }]}">
            1 Oyuncu
          </p>
        </div>
      </div>
    </div>
    <div class="col-4">
      <div class="card bg-transparent">
        <div class="card-body">
          <p
            class="mb-0 lead text-mint text-center"
            use:tooltip="{['Sunucu', { placement: 'bottom' }]}">
            X Çalışma Süresi
          </p>
        </div>
      </div>
    </div>
  </div>
</div>

<script>
  import tooltip from "$lib/tooltip.util";
</script>
