<!-- Site Settings Sub Page -->
<div class="tab-pane">
  <div class="card">
    <div class="card-body animate__animated animate__fadeIn">
      <div class="row mb-3">
        <label class="col-md-4 col-form-label" for="siteTitle">
          Site İsmi
        </label>
        <div class="col col-form-label">
          <input
            bind:value="{data.websiteName}"
            aria-describedby="siteTitle"
            class="form-control form-control-lg border-0 text-black p-0"
            placeholder="İsim"
            id="siteTitle"
            type="text" />
        </div>
      </div>
      <div class="row mb-3">
        <label class="col-md-4 col-form-label" for="siteDesc">
          Site Açıklaması
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
        <label class="col-md-4 col-form-label" for="ipAddress">
          Oyun Sunucu IP Adresi
        </label>
        <div class="col col-form-label">
          <div class="row align-items-center">
            <div class="col">
              <input
                id="ipAddress"
                class="form-control"
                placeholder="play.server.com"
                type="text"
                name="ipAddress"
                bind:value="{data.serverIpAddress}" />
            </div>
          </div>
        </div>
      </div>

      <div class="row mb-3">
        <label class="col-md-4 col-form-label" for="serverGameVersion">
          Oyun Sunucu Versiyonu
        </label>
        <div class="col col-form-label">
          <div class="row align-items-center">
            <div class="col">
              <input
                id="serverGameVersion"
                class="form-control"
                placeholder="1.8.x"
                type="text"
                name="serverGameVersion"
                bind:value="{data.serverGameVersion}" />
            </div>
          </div>
        </div>
      </div>

      <div class="row mb-3">
        <label class="col-md-4 col-form-label" for="supportEmailAddress">
          Destek E-Posta Adresi
        </label>
        <div class="col col-form-label">
          <div class="row align-items-center">
            <div class="col">
              <input
                id="supportEmailAddress"
                class="form-control"
                placeholder="support@{data.websiteName}.com"
                type="email"
                name="supportEmailAddress"
                bind:value="{data.supportEmail}" />
            </div>
          </div>
        </div>
      </div>
      <div class="row mb-3">
        <label class="col-md-4 col-form-label" for="siteKeywords">
          Anahtar Kelimeler
        </label>
        <div class="col col-form-label">
          <form on:submit|preventDefault="{addKeyWord}">
            <input
              id="siteKeywords"
              class="form-control mb-3"
              class:border-danger="{keywordInputError}"
              placeholder="Eklemek için Enter'a basın"
              type="text"
              name="keyword"
              bind:value="{keyword}" />
          </form>
          {#each data.keywords as keyword, index (keyword)}
            <a
              use:tooltip="{['Kaldır', { placement: 'bottom' }]}"
              href="javascript:void(0);"
              on:click="{() => removeKeyWord(index)}">
              <span class="badge rounded-pill bg-light link-primary">
                {keyword}
              </span>
            </a>
          {/each}
        </div>
      </div>
      <div class="row mb-3">
        <label class="col-md-4 col-form-label" for="siteFavicon">
          Favicon
        </label>
        <div class="col col-form-label">
          <div class="row">
            <div class="col-auto">
              <img
                alt="Seç"
                class="d-block ml-auto"
                height="48"
                src="{favicon}"
                width="48" />
            </div>
            <div class="w-100 my-2"></div>
            <div class="col">
              <input
                class="form-control-file"
                id="siteFavicon"
                type="file"
                bind:files="{faviconFiles}"
                on:change="{onFaviconChange}"
                bind:this="{faviconInput}"
                value="" />
              <small class="text-muted">
                PNG, ICO, GIF, JPG, SVG formatında, minimum 1 mb ve 16x16
                boyutlarında olmalı.
              </small>
            </div>
          </div>
        </div>
      </div>

      <div class="row mb-3">
        <label class="col-md-4 col-form-label" for="siteLogo">
          Website Logo
        </label>
        <div class="col col-form-label">
          <div class="row">
            <div class="col-auto">
              <img
                class="d-block ml-auto"
                alt="Sunucu İkonu"
                height="48"
                width="auto"
                src="{websiteLogo}" />
            </div>
            <div class="w-100 my-2"></div>
            <div class="col">
              <input
                class="form-control-file"
                id="siteLogo"
                type="file"
                bind:files="{websiteLogoFiles}"
                on:change="{onWebsiteLogoChange}"
                bind:this="{websiteLogoInput}"
                value="" />
              <small class="text-muted">
                PNG, JPEG, GIF, SVG formatında ve minimum 2 mb olmalı.
              </small>
            </div>
          </div>
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
  import tooltip from "$lib/tooltip.util";

  async function loadData({ request }) {
    return new Promise((resolve, reject) => {
      ApiUtil.get({
        path: "/api/panel/settings?type=website",
        request,
      }).then((body) => {
        if (body.result === "ok") {
          body.oldSettings = { ...body };
          body.oldSettings.keywords = [...body.keywords];

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
      websiteName: "",
      websiteDescription: "",
      supportEmail: "",
      serverIpAddress: "",
      keywords: [],
      oldSettings: {
        websiteName: "",
        websiteDescription: "",
        supportEmail: "",
        serverIpAddress: "",
        serverGameVersion: "",
        keywords: [],
      },
    };

    if (parentData.stuff.NETWORK_ERROR) {
      return data;
    }

    await loadData({ request: event }).then((body) => {
      data = { ...data, ...body };
    });

    return data;
  }
</script>

<script>
  import {
    pageTitle,
    showNetworkErrorOnCatch,
    website,
    websiteLogoSrc,
  } from "$lib/Store.js";

  import { show as showToast } from "$lib/component/ToastContainer.svelte";
  import SettingsSaveSuccessToast from "$lib/component/toasts/SettingsSaveSuccessToast.svelte";
  import SettingsSaveErrorToast from "$lib/component/toasts/SettingsSaveErrorToast.svelte";

  pageTitle.set("Website Ayarları");

  export let data;

  let faviconFiles = [];
  let websiteLogoFiles = [];
  let faviconInput;
  let websiteLogoInput;

  let keyword;
  let saveButtonLoading = false;
  $: isSaveButtonDisabled =
    data.oldSettings.websiteName === data.websiteName &&
    data.oldSettings.websiteDescription === data.websiteDescription &&
    data.oldSettings.supportEmail === data.supportEmail &&
    data.oldSettings.serverIpAddress === data.serverIpAddress &&
    data.oldSettings.serverGameVersion === data.serverGameVersion &&
    JSON.stringify(data.oldSettings.keywords) ===
      JSON.stringify(data.keywords) &&
    faviconFiles.length === 0 &&
    websiteLogoFiles.length === 0;

  let keywordInputError = false;

  let favicon = "/api/favicon";
  let websiteLogo = "/api/websiteLogo";

  function onFaviconChange(event) {
    const reader = new FileReader();
    const image = event.target.files[0];

    reader.readAsDataURL(image);

    reader.onload = (e) => {
      favicon = e.target.result;
    };
  }

  function onWebsiteLogoChange(event) {
    const reader = new FileReader();
    const image = event.target.files[0];

    reader.readAsDataURL(image);

    reader.onload = (e) => {
      websiteLogo = e.target.result;
    };
  }

  function save() {
    saveButtonLoading = true;

    showNetworkErrorOnCatch((resolve, reject) => {
      const formData = new FormData();

      formData.append("websiteName", data.websiteName);
      formData.append("websiteDescription", data.websiteDescription);
      formData.append("supportEmail", data.supportEmail);
      formData.append("serverIpAddress", data.serverIpAddress);
      formData.append("serverGameVersion", data.serverGameVersion);
      formData.append("keywords", data.keywords);

      if (faviconFiles[0]) {
        formData.append("favicon", faviconFiles[0]);
      }

      if (websiteLogoFiles[0]) {
        formData.append("websiteLogo", websiteLogoFiles[0]);
      }

      ApiUtil.put({
        path: "/api/panel/settings",
        body: formData,
      })
        .then((body) => {
          saveButtonLoading = false;

          if (body.result === "ok") {
            website.update((website) => {
              return {
                ...website,
                name: data.websiteName,
                description: data.websiteDescription,
              };
            });

            data.oldSettings = Object.keys(data)
              .filter((key) => key !== "oldSettings" && key !== "keywords")
              .reduce((obj, key) => {
                obj[key] = data[key];
                return obj;
              }, {});

            data.oldSettings.keywords = [...data.keywords];

            showToast(SettingsSaveSuccessToast);

            if (websiteLogoInput.value !== "") {
              const reader = new FileReader();
              const image = websiteLogoFiles[0];

              reader.readAsDataURL(image);

              reader.onload = (e) => {
                websiteLogoSrc.set(e.target.result);
              };
            }

            faviconFiles = [];
            websiteLogoFiles = [];

            faviconInput.value = "";
            websiteLogoInput.value = "";

            resolve();
          } else if (
            body.error === "FAVICON_WRONG_CONTENT_TYPE" ||
            body.error === "FAVICON_EXCEEDS_SIZE" ||
            body.error === "WEBSITE_LOGO_WRONG_CONTENT_TYPE" ||
            body.error === "WEBSITE_LOGO_EXCEEDS_SIZE"
          ) {
            showToast(SettingsSaveErrorToast, {
              errorCode: body.error,
            });
          } else reject();
        })
        .catch((err) => {
          console.log(err);
          reject();
        });
    });
  }

  function addKeyWord() {
    if (!keyword) {
      return;
    }

    if (data.keywords.indexOf(keyword) !== -1) {
      keywordInputError = true;

      return;
    }

    keywordInputError = false;

    data.keywords.push(keyword);

    data.keywords = data.keywords;

    keyword = "";
  }

  function removeKeyWord(index) {
    data.keywords = data.keywords.remove(index);
  }

  Array.prototype.equals = function (array) {
    // if the other array is a falsy value, return
    if (!array) return false;

    // compare lengths - can save a lot of time
    if (this.length != array.length) return false;

    for (let i = 0, l = this.length; i < l; i++) {
      // Check if we have nested arrays
      if (this[i] instanceof Array && array[i] instanceof Array) {
        // recurse into the nested arrays
        if (!this[i].equals(array[i])) return false;
      } else if (this[i] != array[i]) {
        // Warning - two different object instances will never be equal: {x:20} != {x:20}
        return false;
      }
    }
    return true;
  };
  // Hide method from for-in loops
  Object.defineProperty(Array.prototype, "equals", { enumerable: false });
</script>
