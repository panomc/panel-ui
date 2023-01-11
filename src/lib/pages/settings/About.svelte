<!-- About Sup Page -->
<div class="tab-pane">
  <div class="card">
    <div class="card-body">
      <h5 class="card-title">PanoCMS</h5>
      <form class="animate__animated animate__fadeIn">
        <div class="row">
          <label class="col-sm-2 col-form-label" for="panoVersion">
            Versiyon
          </label>
          <div class="col col-form-label">
            <span aria-describedby="panoVersion" id="panoVersion"
              >{data.platformVersion}</span>
          </div>
        </div>
        <div class="row">
          <label class="col-sm-2 col-form-label" for="siteKeywords">
            Sürüm
          </label>
          <div class="col col-form-label">
            <span aria-describedby="panoRelease" id="panoRelease"
              >{data.platformStage}</span>
          </div>
        </div>
        <div class="row mb-0">
          <label class="col-sm-2 col-form-label" for="siteKeywords">
            Web Site
          </label>
          <div class="col col-form-label">
            <a
              aria-describedby="panoWebsite"
              href="https://panocms.com"
              id="panoWebsite"
              target="_blank">
              panocms.com <i class="fa-solid fa-up-right-from-square ms-2"></i>
            </a>
          </div>
        </div>
        <div class="row mb-0">
          <label class="col-sm-2 col-form-label" for="siteKeywords">
            Discord
          </label>
          <div class="col col-form-label">
            <a
              aria-describedby="panoWebsite"
              href="https://panocms.com/discord"
              id="panoWebsite"
              target="_blank">
              Qm8bfzJ9HB <i class="fa-solid fa-up-right-from-square ms-2"></i>
            </a>
          </div>
        </div>
      </form>
    </div>
  </div>

  <div class="card">
    <div class="card-body animate__animated animate__fadeIn">
      <h5
        class="card-title animate__animated animate__heartBeat animate__slower d-inline-block">
        Açık Kaynak Lisanslar ❤️
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

<script context="module">
  import ApiUtil from "$lib/api.util.js";

  async function loadData({ request }) {
    return new Promise((resolve, reject) => {
      ApiUtil.get({
        path: "/api/panel/settings/about",
        request,
      }).then((body) => {
        if (body.result === "ok") {
          resolve(body);
        } else {
          reject(body);
        }
      });
    });
  }

  /**
   * @type {import("@sveltejs/kit").Load}
   */
  export async function load(event) {
    const { parent } = event;
    const parentData = await parent();

    let data = {
      platformVersion: "",
      platformStage: "",
    };

    if (parentData.NETWORK_ERROR) {
      return data;
    }

    await loadData({ request: event }).then((body) => {
      data = { ...data, ...body };
    });

    return data;
  }
</script>

<script>
  import { page } from "$app/stores";

  export let data;

  const { pageTitle } = $page.data;

  pageTitle.set("Hakkında");
</script>
