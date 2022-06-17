<!-- General Settings Sub Page -->
<div class="tab-pane">
  <div class="card">
    <div class="card-body animate__animated animate__fadeIn">
      <h5 class="card-title">Platform Ayarları</h5>
      <div class="row mb-3">
        <label class="col-md-4 col-form-label" for="platformLangueage">
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
      <div class="row mb-3 justify-content-between">
        <label class="col-md-4 col-form-label" for="platformLangueage">
          Otomatik güncellemeleri denetle:
        </label>
        <div class="col">
          <select class="form-control" bind:value="{data.updatePeriod}">
            <option value="{UpdatePeriod.NEVER}">Asla</option>
            <option value="{UpdatePeriod.ONCE_PER_DAY}">Günde bir kez</option>
            <option value="{UpdatePeriod.ONCE_PER_WEEK}"
              >Haftada bir kez
            </option>
            <option value="{UpdatePeriod.ONCE_PER_MONTH}">Ayda bir kez </option>
          </select>
        </div>
      </div>

      <button
        class="btn btn-secondary"
        class:disabled="{saveButtonLoading || isSaveButtonDisabled}"
        aria-disabled="{saveButtonLoading || isSaveButtonDisabled}"
        disabled="{saveButtonLoading || isSaveButtonDisabled}"
        on:click="{save}"
        >Kaydet
      </button>
    </div>
  </div>
</div>

<script context="module">
  import ApiUtil from "$lib/api.util.js";

  export const UpdatePeriod = Object.freeze({
    NEVER: "never",
    ONCE_PER_DAY: "oncePerDay",
    ONCE_PER_WEEK: "oncePerWeek",
    ONCE_PER_MONTH: "oncePerMonth",
  });

  async function loadData({ request, CSRFToken }) {
    return new Promise((resolve, reject) => {
      ApiUtil.get({
        path: "/api/panel/settings?type=general",
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
          updatePeriod: UpdatePeriod.ONCE_PER_DAY,
          oldSettings: {
            updatePeriod: UpdatePeriod.ONCE_PER_DAY,
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
  import { pageTitle, showNetworkErrorOnCatch } from "$lib/store.js";
  import { session } from "$app/stores";

  pageTitle.set("Genel Ayarlar");

  export let data;

  let saveButtonLoading = false;
  $: isSaveButtonDisabled = data.oldSettings.updatePeriod === data.updatePeriod;

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
          updatePeriod: data.updatePeriod,
        },
        CSRFToken: $session.CSRFToken,
      })
        .then((body) => {
          if (body.result === "ok") {
            saveButtonLoading = false;

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
