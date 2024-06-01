<AddPluginModal />
<div class="container">
  <!-- Action Menu -->
  <PageActions>
    <a
      class="btn btn-link d-none"
      role="button"
      href="/addons/categories"
      slot="left">
      <i class="fas fa-puzzle-piece me-2"></i>
      Eklenti Kategorileri
    </a>
    <a
      href="javascript:void(0);"
      class="btn btn-secondary ml-auto"
      role="button"
      slot="right"
      on:click="{showAddPluginModal}">
      <i class="fas fa-plus me-2"></i>
      Eklenti Yükle
    </a>
  </PageActions>

  <!-- All Addons -->
  <div class="card">
    <div class="card-body">
      <CardHeader>
        <h5 class="card-title" slot="left">{data.plugins.length} Yüklü Eklenti</h5>
        <!-- Filters -->
        <CardFilters slot="right">
          <CardFiltersItem href="/addons/all" active="{data.pageType === PageTypes.ALL}">Tümü</CardFiltersItem>
          <CardFiltersItem href="/addons/active" active="{data.pageType === PageTypes.ACTIVE}">Aktif</CardFiltersItem>
          <CardFiltersItem href="/addons/disabled" active="{data.pageType === PageTypes.DISABLED}">Devre Dışı</CardFiltersItem>
        </CardFilters>
      </CardHeader>

      <div class="row row-cols-xl-2 row-cols-1 g-3">
        {#each data.plugins as plugin, index (plugin)}
        <div class="col">
          <!-- Installed Addon Card -->
          <div class="card border {plugin.status === 'FAILED' && 'border-danger border-3'} h-100">
            <div class="card-body">
              <div class="row h-100">
                <div class="col-md-4 d-md-flex d-none">
                  <a href="{base}/addons/detail/{plugin.id}">
                    <img
                      src="{API_URL}/panel/plugins/{plugin.id}/logo"
                      class="img-thumbnail animate__animated animate__zoomIn"
                      alt="{plugin.id}" />
                  </a>
                </div>
                <div class="col">
                  <div class="row">
                    <div class="col">
                      <a href="{base}/addons/detail/{plugin.id}">
                        <h5 class="card-title">{plugin.id}</h5>
                      </a>
                    </div>
                    <div class="col-auto">
                      <div class="form-check form-switch">
                        <input
                          class="form-check-input"
                          type="checkbox"
                          role="switch"
                          id="addonStatusSwitch"
                          checked="{plugin.status === 'STARTED'}" />
                        <label class="form-check-label" for="addonStatusSwitch"
                          >Aktif</label>
                      </div>
                    </div>
                    {#if plugin.status === 'FAILED'}
                    <div class="col-auto">
                      <a
                        href="#"
                        tabindex="0"
                        class="link-danger"
                        data-bs-toggle="popover"
                        data-bs-trigger="focus"
                        data-bs-custom-class="font-monospace"
                        data-bs-title="Error Log"
                        data-bs-content="{plugin.error}">
                        <i class="fa-solid fa-circle-exclamation fa-1x"></i>
                      </a>
                    </div>
                      {/if}
                  </div>
                  <small class="text-muted">
                    Yapımcı: <a href="/" target="_blank">{plugin.author}</a>
                    <div class="vr mx-2"></div>
                    <span class="font-monospace">{plugin.version}</span>
                    {#if plugin.license}
                      <div class="vr mx-2"></div>
                    <span class="font-monospace">{plugin.license}</span>
                    {/if}
                      {#if plugin.verifyStatus !== "UNKNOWN"}
                    <div class="vr mx-2"></div>
                        {/if}
                      {#if plugin.verifyStatus === "VERIFIED"}
                        <span class="text-success">
                      <i class="fa-regular fa-circle-check me-1"></i>
                        </span>
                        {:else if plugin.verifyStatus === "NOT_VERIFIED"}
                        <span class="text-warning">
                        <i class="fa-solid fa-circle-exclamation me-1"></i>
                        </span>
                      {/if}
                  </small>
                  <p class="pt-2">
                    {@html plugin.description}
                  </p>
                  {#if plugin.sourceUrl}
                  <a href="{plugin.sourceUrl}" target="_blank" class="card-link">
                    <i class="fa-solid fa-arrow-up-right-from-square me-2"></i> Kaynak</a>
                    {/if}
                  <a href="https://panomc.com/addons/detail/{plugin.id}" target="_blank" class="card-link">
                    <i class="fa-solid fa-arrow-up-right-from-square me-2"></i> Mağazada
                    Görüntüle</a>
                </div>
              </div>
            </div>
          </div>
        </div>
          {/each}
      </div>
    </div>
  </div>
</div>

<script context="module">
  import ApiUtil from "$lib/api.util.js";

  export const PageTypes = Object.freeze({
    ALL: "ALL",
    ACTIVE: "ACTIVE",
    DISABLED: "DISABLED",
  });

  export const DefaultPageType = PageTypes.ALL;

  async function loadData({ request, pageType }) {
    return new Promise((resolve, reject) => {
      ApiUtil.get({
        path: `/api/panel/plugins?status=${pageType.toUpperCase()}`,
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
   * @type {import('@sveltejs/kit').PageLoad}
   */
  export async function load(event, pageType = DefaultPageType) {
    const { parent } = event;
    const parentData = await parent();

    pageType = pageType.toUpperCase();

    let data = {
      plugins: [],
      pageType
    };

    if (parentData.NETWORK_ERROR) {
      return data;
    }

    await loadData({ request: event, pageType }).then((body) => {
      data = { ...data, ...body };
    });

    return data;
  }
</script>

<script>
  import { getContext } from "svelte";

  import { base } from "$app/paths";

  import { API_URL } from "$lib/variables";

  import PageActions from "$lib/component/PageActions.svelte";
  import CardHeader from "$lib/component/CardHeader.svelte";
  import CardFiltersItem from "$lib/component/CardFiltersItem.svelte";
  import CardFilters from "$lib/component/CardFilters.svelte";
  import AddPluginModal, {
    show as showAddPluginModal,
  } from "$lib/component/modals/AddPluginModal.svelte";

  export let data;

  const pageTitle = getContext("pageTitle");

  pageTitle.set("Eklentiler");
</script>
