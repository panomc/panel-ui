<!-- Site Settings Sub Page -->
<div class="tab-pane">
  <div class="card">
    <div class="card-body animate__animated animate__fadeIn">
      <h5 class="card-title">Website Ayarları</h5>
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
        <label class="col-md-4 col-form-label" for="siteKeywords">
          Anahtar Kelimeler
        </label>
        <div class="col col-form-label">
          <form on:submit|preventDefault="{addKeyWord}">
            <input
              class="form-control mb-3"
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
  import tooltip from "$lib/tooltip.util";

  async function loadData({ request, CSRFToken }) {
    return new Promise((resolve, reject) => {
      ApiUtil.get({
        path: "/api/panel/settings?type=website",
        request,
        CSRFToken,
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
   * @type {import('@sveltejs/kit').Load}
   */
  export async function load(request) {
    let output = {
      props: {
        data: {
          websiteName: "",
          websiteDescription: "",
          keywords: [],
          oldSettings: {
            websiteName: "",
            websiteDescription: "",
            keywords: [],
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

  let keyword;
  let saveButtonLoading = false;
  $: isSaveButtonDisabled =
    data.oldSettings.websiteName === data.websiteName &&
    data.oldSettings.websiteDescription === data.websiteDescription &&
    data.oldSettings.keywords.join() === data.keywords.join();

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
          keywords: data.keywords,
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

  function addKeyWord() {
    if (!keyword) {
      return;
    }

    data.keywords.push(keyword);

    data.keywords = data.keywords;

    keyword = "";
  }

  function removeKeyWord(index) {
    data.keywords = data.keywords.remove(index);
  }
</script>
