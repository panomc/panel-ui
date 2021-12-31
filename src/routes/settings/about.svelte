<!-- About Sup Page -->
<div class="tab-pane">
  <div class="card">
    <div class="card-body">
      <h5 class="card-title">Pano Hakkında</h5>
      <form class="animate__animated animate__fadeIn">
        <div class="row">
          <label class="col-sm-2 col-form-label" for="panoVersion">
            Versiyon:
          </label>
          <div class="col">
            <span
              aria-describedby="panoVersion"
              id="panoVersion">
              1.0
          </span>
          </div>
        </div>
        <div class="row">
          <label class="col-sm-2 col-form-label" for="siteKeywords">
            Sürüm:
          </label>
          <div class="col">
            <span
              aria-describedby="panoRelease"
              id="panoRelease">
              Beta
            </span>
          </div>
        </div>
        <div class="row mb-0">
          <label class="col-sm-2 col-form-label" for="siteKeywords">
            Resmi Website:
          </label>
          <div class="col">
            <a
              aria-describedby="panoWebsite"
              href="https://panocms.com"
              id="panoWebsite"
              target="_blank">
              www.panocms.com
            </a>
          </div>
        </div>
        <div class="row mb-0">
          <label class="col-sm-2 col-form-label" for="siteKeywords">
            Discord:
          </label>
          <div class="col">
            <a
              aria-describedby="panoWebsite"
              href="https://panocms.com/discord"
              id="panoWebsite"
              target="_blank">
              Pano Discord
            </a>
          </div>
        </div>
      </form>
    </div>
  </div>

  <div class="card">
    <div class="card-body animate__animated animate__fadeIn">
      <h5
        class="card-title animate__animated animate__heartBeat animate__slower animate__repeat-2 d-inline-block">
        Açık Kaynak Lisansları ❤️
      </h5>

      <!-- Bootstrap 4.3 License -->
      <details>
        <summary class="h6 text-primary">Bootstrap 4.3</summary>
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Quia quisquam
          assumenda dolor eligendi fugit, architecto ab vero possimus minus
          consequatur delectus aut quam voluptatem debitis ullam ea voluptate
          inventore rem!
        </p>
      </details>

      <!-- Another Software License -->
      <details>
        <summary class="h6 text-primary">Another Software</summary>
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Quia quisquam
          assumenda dolor eligendi fugit, architecto ab vero possimus minus
          consequatur delectus aut quam voluptatem debitis ullam ea voluptate
          inventore rem!
        </p>
      </details>
    </div>
  </div>
</div>

<script>
  import { pageTitle } from "$lib/store";

  pageTitle.set("Pano Hakkında")
</script>
