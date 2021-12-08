<!-- General Settings Sub Page -->
<div class="tab-pane">
  <div class="card">
    <div class="card-body animate__animated animate__fadeIn">
      <h5 class="card-title">Platform Ayarları</h5>
      <form>
        <div class="form-group row">
          <label class="col-md-4 col-form-labeel" for="platformLangueage">
            Platform Dili:
          </label>
          <div class="col">
            <select class="form-control" id="platformLanguage">
              <option id="setPlatformLangueageTR" selected>Türkçe</option>
              <option id="setPlatformLangueageEN">İngilizce</option>
            </select>
          </div>
        </div>

        <h5 class="card-title">Güncelleme Tercihleri</h5>
        <div class="form-group row mb-0 justify-content-between">
          <label class="col-md-4 col-form-labeel" for="platformLangueage">
            Otomatik güncellemeleri denetle:
          </label>
          <div class="col">
            <select class="form-control" id="autoUpdatesOptions">
              <option id="autoUpdatesOption1" selected>Asla</option>
              <option id="autoUpdatesOption2" selected>Günde bir kez</option>
              <option id="autoUpdatesOption3">Haftada bir kez</option>
              <option id="autoUpdatesOption3">Ayda bir kez</option>
            </select>
          </div>
        </div>

        <div class="form-group">
          <button class="btn btn-secondary mt-3" type="submit">Kaydet</button>
        </div>
      </form>
    </div>
  </div>
</div>

<script>
  import { pageTitle } from "$lib/store";

  pageTitle.set("Genel Ayarlar")
</script>
