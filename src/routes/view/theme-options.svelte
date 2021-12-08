<!-- Theme Options Categories -->
<section>
  <div class="card">
    <nav class="border-bottom border-glass rounded-top page-category">
      <div class="nav nav-link d-flex flex-row w-100">
        <a href="" class="nav-item nav-link active"> Yazılar </a>
        <a href="" class="nav-item nav-link">Renkler</a>
        <a href="" class="nav-item nav-link">Düzen</a>
        <a href="" class="nav-item nav-link">Diğer</a>
      </div>
    </nav>
    <div class="card-body animate__animated animate__fadeIn">
      <div class="row justify-content-between pb-2">
        <div class="col-6 text-left">
          <h5 class="card-title">Yazı Seçenekleri</h5>
        </div>
      </div>
      <form>
        <div class="form-group row">
          <label class="col-md-2 col-form-labeel" for="postAmount">
            Yazı Adeti:
          </label>
          <div class="col-md-10">
            <select class="form-control" id="postAmount">
              <option id="setPostAmount1" selected>1</option>
              <option id="setPostAmount2">2</option>
              <option id="setPostAmount3">3</option>
              <option id="setPostAmount4">4</option>
              <option id="setPostAmount5">5</option>
            </select>
          </div>
        </div>
        <div class="form-group row">
          <label class="col-md-2 col-form-labeel" for="dateFormat">
            Tarih Formatı:
          </label>
          <div class="col-md-10">
            <div class="form-check custom-control custom-radio">
              <input
                checked
                class="form-check-input custom-control-input"
                id="dateFormat1"
                name="dateFormats"
                type="radio"
                value="option1" />
              <label
                class="form-check-label custom-control-label"
                for="dateFormat1">
                01/01/2019
              </label>
            </div>
            <div class="form-check custom-control custom-radio">
              <input
                class="form-check-input custom-control-input"
                id="dateFormat2"
                name="dateFormats"
                type="radio"
                value="option2" />
              <label
                class="form-check-label custom-control-label"
                for="dateFormat2">
                01.01.2019
              </label>
            </div>
            <div class="form-check custom-control custom-radio">
              <input
                class="form-check-input custom-control-input"
                id="dateFormat3"
                name="dateFormats"
                type="radio"
                value="option3" />
              <label
                class="form-check-label custom-control-label"
                for="dateFormat3">
                01-01-2019
              </label>
            </div>
          </div>
        </div>
        <div class="form-group row">
          <label class="col-md-2 col-form-labeel" for="siteLanguageSwitch">
            Dil Değişim Paneli:
          </label>
          <div class="col-md-10">
            <div class="custom-control custom-checkbox">
              <input
                class="custom-control-input"
                id="siteLanguageSwitch"
                type="checkbox" />
              <label class="custom-control-label" for="siteLanguageSwitch">
                Göster
              </label>
            </div>
          </div>
        </div>
        <div class="form-group pt-4 mb-0">
          <button class="btn btn-secondary text-light" type="submit">
            Değişiklikleri Kaydet
          </button>
        </div>
      </form>
    </div>
  </div>
</section>

<script>
  import { pageTitle } from "$lib/store";

  pageTitle.set("Tema Ayarları")
</script>
