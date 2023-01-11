<!-- Theme Options Categories -->
<section>
  <div class="card">
    <div class="card-body animate__animated animate__fadeIn">
      <div class="row justify-content-between pb-2">
        <div class="col-md-auto col-12 text-md-left text-center">
          <h5 class="card-title">Yazı Seçenekleri</h5>
        </div>
      </div>
      <form>
        <div class="mb-3 row">
          <label class="col-sm-3 col-form-label" for="postAmount">
            Yazı Adeti:
          </label>
          <div class="col">
            <select class="form-control" id="postAmount">
              <option id="setPostAmount1" selected>1</option>
              <option id="setPostAmount2">2</option>
              <option id="setPostAmount3">3</option>
              <option id="setPostAmount4">4</option>
              <option id="setPostAmount5">5</option>
            </select>
          </div>
        </div>
        <div class="mb-3 row">
          <label class="col-sm-3 col-form-label" for="dateFormat">
            Tarih Formatı:
          </label>
          <div class="col">
            <select class="form-control" id="dateFormat">
              <option id="dateFormat1" selected>1</option>
              <option id="dateFormat2">1</option>
            </select>
          </div>
        </div>
      </form>
    </div>
  </div>
</section>

<script>
  import { page } from "$app/stores";

  const { pageTitle } = $page.data;

  pageTitle.set("Tema Ayarları");
</script>
