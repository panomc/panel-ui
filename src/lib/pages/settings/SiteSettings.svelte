<!-- Site Settings Sub Page -->
<div class="tab-pane">
  <div class="card">
    <div class="card-body  animate__animated animate__fadeIn">
      <h5 class="card-title">Website Ayarları</h5>
      <div class="row mb-3">
        <label class="col-md-4 col-form-label" for="siteTitle">
          Site Başlığı:
        </label>
        <div class="col">
          <input
            bind:value="{data.websiteName}"
            aria-describedby="siteTitle"
            class="form-control"
            id="siteTitle"
            type="text" />
        </div>
      </div>
      <div class="row mb-3">
        <label class="col-md-4 col-form-label" for="siteDesc">
          Site Açıklaması:
        </label>
        <div class="col">
          <textarea
            bind:value="{data.websiteDescription}"
            aria-describedby="siteDesc"
            class="form-control"
            id="siteDesc"
            rows="2"></textarea>
        </div>
      </div>
      <div class="row mb-3">
        <label class="col-md-4 col-form-label" for="siteKeywords">
          Anahtar Kelimeler:
        </label>
        <div class="col">
          <textarea
            aria-describedby="siteKeywords"
            class="form-control"
            id="siteKeywords"
            rows="2"></textarea>
          <small>
            Anahtar kelimeleri virgül ile ayırın. Örnek: panocraft, minecraft,
            server
          </small>
        </div>
      </div>
      <div class="row mb-3">
        <label class="col-md-4 col-form-label" for="siteFavicon">
          Favicon:
        </label>
        <div class="col">
          <div class="row">
            <div class="col-auto">
              <img
                alt="Seç"
                class="d-block ml-auto"
                height="48"
                src="http://icons.iconarchive.com/icons/ampeross/lamond/256/minecraft-icon.png"
                width="48" />
            </div>
            <div class="col">
              <input class="form-control-file" id="siteFavicon" type="file" />
              <small> PNG, ICO ve minimum 16x16 boyutlarında olmalıdır. </small>
            </div>
          </div>
        </div>
      </div>

      <button
        class="btn btn-secondary"
        class:disabled="{saveButtonLoading || isSaveButtonDisabled}"
        aria-disabled="{saveButtonLoading || isSaveButtonDisabled}"
        disabled="{saveButtonLoading || isSaveButtonDisabled}"
        on:click="{save}">Kaydet</button>
    </div>
  </div>
</div>

<script context="module">
  import ApiUtil from "$lib/api.util.js";

  async function loadData({ request, CSRFToken }) {
    return new Promise((resolve, reject) => {
      ApiUtil.get({
        path: "/api/panel/settings?type=website",
        request,
        CSRFToken,
      }).then((body) => {
        if (body.result === "ok") {
          body.oldSettings = body;

          resolve(body);
        } else {
          reject(body);
        }
      });
    });
  }

  /**
   * @type {import('@sveltejs/kit').Load}
   */
  export async function load(request) {
    let output = {
      props: {
        data: {
          websiteName: "",
          websiteDescription: "",
          oldSettings: {
            websiteName: "",
            websiteDescription: "",
          },
        },
      },
    };

    if (request.stuff.NETWORK_ERROR) {
      output.props.data.NETWORK_ERROR = true;

      return output;
    }

    await loadData({ request }).then((body) => {
      output.props.data = { ...output.props.data, ...body };
    });

    return output;
  }
</script>

<script>
  import { pageTitle, showNetworkErrorOnCatch, website } from "$lib/store.js";
  import { session } from "$app/stores";

  pageTitle.set("Website Ayarları");

  export let data;

  let saveButtonLoading = false;
  $: isSaveButtonDisabled =
    data.oldSettings.websiteName === data.websiteName &&
    data.oldSettings.websiteDescription === data.websiteDescription;

  if (data.NETWORK_ERROR) {
    showNetworkErrorOnCatch((resolve, reject) => {
      loadData({ CSRFToken: $session.CSRFToken })
        .then((body) => {
          data = { ...data, ...body };
          resolve();
        })
        .catch(() => {
          reject();
        });
    }, true);
  }

  function save() {
    saveButtonLoading = true;

    showNetworkErrorOnCatch((resolve, reject) => {
      ApiUtil.put({
        path: "/api/panel/settings",
        body: {
          websiteName: data.websiteName,
          websiteDescription: data.websiteDescription,
        },
        CSRFToken: $session.CSRFToken,
      })
        .then((body) => {
          if (body.result === "ok") {
            saveButtonLoading = false;

            website.update((website) => {
              return {
                ...website,
                name: data.websiteName,
                description: data.websiteDescription,
              };
            });

            data.oldSettings = Object.keys(data)
              .filter((key) => key !== "oldSettings")
              .reduce((obj, key) => {
                obj[key] = data[key];
                return obj;
              }, {});

            //TODO TOAST

            resolve();
          } else reject();
        })
        .catch(() => {
          reject();
        });
    });
  }
</script>
