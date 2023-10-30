<!-- General Settings Sub Page -->
<div class="card bg-white">
  <div class="card-body animate__animated animate__fadeIn">
    <div class="row mb-3">
      <label class="col-md-4 col-form-label" for="platformDevMode">
        Geliştirici Modu:
      </label>
      <div class="col d-flex align-items-center">
        <div class="form-check form-switch">
          <input
            class="form-check-input"
            type="checkbox"
            role="switch"
            id="platformDevMode" />
        </div>
      </div>
    </div>
    <div class="row mb-3">
      <label class="col-md-4 col-form-label" for="platformLanguage">
        {$_("pages.settings.platform.display-language")}
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

    <h5 class="card-title">
      {$_("pages.settings.platform.update-preferences")}
    </h5>
    <div class="row mb-3 justify-content-between">
      <label class="col-md-4 col-form-label" for="updatePeriod">
        {$_("pages.settings.platform.check-auto-updates")}
      </label>
      <div class="col">
        <select
          class="form-control"
          bind:value="{data.updatePeriod}"
          id="updatePeriod">
          <option value="{UpdatePeriod.NEVER}"
            >{$_(
              "pages.settings.platform.inputs.check-auto-updates.never"
            )}</option>
          <option value="{UpdatePeriod.ONCE_PER_DAY}"
            >{$_(
              "pages.settings.platform.inputs.check-auto-updates.once-in-a-day"
            )}</option>
          <option value="{UpdatePeriod.ONCE_PER_WEEK}"
            >{$_(
              "pages.settings.platform.inputs.check-auto-updates.once-in-a-week"
            )}
          </option>
          <option value="{UpdatePeriod.ONCE_PER_MONTH}"
            >{$_(
              "pages.settings.platform.inputs.check-auto-updates.once-in-a-month"
            )}</option>
        </select>
      </div>
    </div>

    <button
      class="btn btn-secondary"
      class:disabled="{saveButtonLoading || isSaveButtonDisabled}"
      aria-disabled="{saveButtonLoading || isSaveButtonDisabled}"
      on:click="{save}"
      >{$_("pages.settings.platform.save-button")}
    </button>
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

  async function loadData({ request }) {
    return new Promise((resolve, reject) => {
      ApiUtil.get({
        path: "/api/panel/settings?type=general",
        request,
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
    const parentData = await parent();

    let data = {
      updatePeriod: UpdatePeriod.ONCE_PER_DAY,
      locale: "",
      oldSettings: {
        updatePeriod: UpdatePeriod.ONCE_PER_DAY,
        locale: "",
      },
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
  import { getContext } from "svelte";
  import { _ } from "svelte-i18n";

  import { showNetworkErrorOnCatch } from "$lib/Store";

  import { show as showToast } from "$lib/component/ToastContainer.svelte";
  import {
    changeLanguage,
    getLanguageByLocale,
    Languages,
  } from "$lib/language.util";
  import SettingsSaveSuccessToast from "$lib/component/toasts/SettingsSaveSuccessToast.svelte";

  const pageTitle = getContext("pageTitle");

  pageTitle.set("pages.settings.platform.title");

  export let data;

  let saveButtonLoading = false;
  $: isSaveButtonDisabled =
    data.oldSettings.updatePeriod === data.updatePeriod &&
    data.oldSettings.locale === data.locale;

  function save() {
    saveButtonLoading = true;

    showNetworkErrorOnCatch((resolve, reject) => {
      const formData = new FormData();

      formData.append("updatePeriod", data.updatePeriod);
      formData.append("locale", data.locale);

      ApiUtil.put({
        path: "/api/panel/settings",
        body: formData,
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

            showToast(SettingsSaveSuccessToast);

            resolve();
          } else reject();
        })
        .catch(() => {
          reject();
        });
    });
  }
</script>
