<div class="card bg-white animate__animated animate__fadeIn">
  <div class="card-body">
    <div class="row">
      <label class="col-md-4 col-form-label" for="mainServer">
        Giriş Entegrasyonu
      </label>
      <div class="col col-form-label">
        <div class="form-check form-switch">
          <input
            class="form-check-input"
            type="checkbox"
            role="switch"
            id="flexSwitchCheckChecked"
            checked />
          <label class="form-check-label" for="flexSwitchCheckChecked"></label>
        </div>
      </div>
    </div>
  </div>
</div>

<script>
  import { getContext } from "svelte";

  const pageTitle = getContext("pageTitle");

  pageTitle.set("Oyun Entegrasyon Ayarları");
</script>