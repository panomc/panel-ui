<div class="container">

  <div
    class="row justify-content-between mb-3 animate__animated animate__slideInUp">
    <div class="col-4">
      <div class="card bg-secondary">
        <div class="card-body">
          <p
            class="mb-0 lead text-white"
            use:tooltip="{['Sunucu', { placement: 'bottom' }]}">
            Sunucu Çevrimiçi
          </p>
        </div>
      </div>
    </div>
    <div class="col-4">
      <div class="card">
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
      <div class="card">
        <div class="card-body">
          <p
            class="mb-0 lead text-dark text-center"
            use:tooltip="{['Sunucu', { placement: 'bottom' }]}">
            X Çalışma Süresi
          </p>
        </div>
      </div>
    </div>
  </div>


  <!-- Statistic Table -->
  <div class="card">
    <div class="card-body">
      <h5 class="card-title">İstatistik</h5>
      <div class="table-responsive">
        <table class="table table-borderless table-hover m-0">
          <tbody class="text-muted">
            <tr>
              <th scope="row">DATA:</th>
              <td>DATA</td>
            </tr>
            <tr>
              <th scope="row">DATA:</th>
              <td>DATA</td>
            </tr>
            <tr>
              <th scope="row">DATA:</th>
              <td>DATA</td>
            </tr>
            <tr>
              <th scope="row">DATA:</th>
              <td>DATA</td>
            </tr>
            <tr>
              <th scope="row">DATA:</th>
              <td>DATA</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</div>

<script>
  import tooltip from "$lib/tooltip.util";
</script>
