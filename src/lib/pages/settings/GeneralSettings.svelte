<!-- General Settings Sub Page -->
<div class="tab-pane">
  <div class="card">
    <div class="card-body animate__animated animate__fadeIn">
      <h5 class="card-title">Platform Ayarları</h5>
      <div class="row mb-3">
        <label class="col-md-4 col-form-label" for="platformLanguage">
          Görüntüleme Dili:
        </label>
        <div class="col">
          <select
            class="form-control"
            id="platformLanguage"
            bind:value="{data.locale}">
            {#each Object.keys(Languages) as language, index (language)}
              <option value="{Languages[language].locale}"
                >{Languages[language].name}</option>
            {/each}
          </select>
        </div>
      </div>

      <h5 class="card-title">Güncelleme Tercihleri</h5>
      <div class="row mb-3 justify-content-between">
        <label class="col-md-4 col-form-label" for="updatePeriod">
          Otomatik güncellemeleri denetle:
        </label>
        <div class="col">
          <select
            class="form-control"
            bind:value="{data.updatePeriod}"
            id="updatePeriod">
            <option value="{UpdatePeriod.NEVER}">Asla</option>
            <option value="{UpdatePeriod.ONCE_PER_DAY}">Günde bir kez</option>
            <option value="{UpdatePeriod.ONCE_PER_WEEK}"
              >Haftada bir kez
            </option>
            <option value="{UpdatePeriod.ONCE_PER_MONTH}">Ayda bir kez</option>
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
   * @type {import('@sveltejs/kit').PageLoad}
   */
  export async function load(event) {
    const { parent } = event;
    await parent();

    let data = {
      updatePeriod: UpdatePeriod.ONCE_PER_DAY,
      locale: "",
      oldSettings: {
        updatePeriod: UpdatePeriod.ONCE_PER_DAY,
        locale: "",
      },
    };

    // if (event.stuff.NETWORK_ERROR) {
    //   output.props.data.NETWORK_ERROR = true;
    //
    //   return output;
    // }

    await loadData({ request: event }).then((body) => {
      data = { ...data, ...body };
    });

    return data;
  }
</script>

<script>
  import { pageTitle, session, showNetworkErrorOnCatch } from "$lib/Store";

  import { show as showToast } from "$lib/component/ToastContainer.svelte";
  import {
    changeLanguage,
    getLanguageByLocale,
    Languages,
  } from "$lib/language.util";
  import SettingsSavedToast from "$lib/component/toasts/SettingsSavedToast.svelte";

  pageTitle.set("Genel Ayarlar");

  export let data;

  let saveButtonLoading = false;
  $: isSaveButtonDisabled =
    data.oldSettings.updatePeriod === data.updatePeriod &&
    data.oldSettings.locale === data.locale;

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
          locale: data.locale,
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

            changeLanguage(getLanguageByLocale(data.locale));

            showToast(SettingsSavedToast);

            resolve();
          } else reject();
        })
        .catch(() => {
          reject();
        });
    });
  }
</script>
