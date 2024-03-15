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
        <h5 class="card-title" slot="left">7 Yüklü Eklenti</h5>
        <!-- Filters -->
        <CardFilters slot="right">
          <CardFiltersItem href="/addons/all" active>Tümü</CardFiltersItem>
          <CardFiltersItem href="/addons/active">Aktif</CardFiltersItem>
          <CardFiltersItem href="/addons/disabled">Devre Dışı</CardFiltersItem>
        </CardFilters>
      </CardHeader>

      <div class="row row-cols-xl-2 row-cols-1 g-3">
        <div class="col">
          <!-- Installed Addon Card -->
          <div class="card border h-100">
            <div class="card-body">
              <div class="row h-100">
                <div class="col-md-4 d-md-flex d-none">
                  <a href="/panel/addons/detail">
                    <img
                      src="https://bitcoin.org/img/home/bitcoin-img.svg"
                      class="img-thumbnail animate__animated animate__zoomIn"
                      alt="Bitcoin Payment" />
                  </a>
                </div>
                <div class="col">
                  <div class="row">
                    <div class="col">
                      <a href="/panel/addons/detail">
                        <h5 class="card-title">Bitcoin Payment</h5>
                      </a>
                    </div>
                    <div class="col-auto">
                      <div class="form-check form-switch">
                        <input
                          class="form-check-input"
                          type="checkbox"
                          role="switch"
                          id="addonStatusSwitch"
                          checked />
                        <label class="form-check-label" for="addonStatusSwitch"
                          >Aktif</label>
                      </div>
                    </div>
                  </div>
                  <small class="text-muted">
                    Yapımcı: <a href="/" target="_blank">Kahverengi</a>
                    <div class="vr mx-2"></div>
                    <span class="font-monospace">local-build</span>
                    <div class="vr mx-2"></div>
                    <span class="text-success">
                      <i class="fa-regular fa-circle-check me-1"></i> Onaylandı
                    </span>
                  </small>
                  <p class="pt-2">
                    Lorem ipsum dolor sit amet consectetur, adipisicing elit.
                    Ipsam id amet soluta aspernatur beatae culpa, modi ab
                    consectetur...
                  </p>
                  <a href="#" target="_blank" class="card-link">
                    <i class="fa-solid fa-arrow-up-right-from-square me-2"></i> Kaynak</a>
                  <a href="#" target="_blank" class="card-link">
                    <i class="fa-solid fa-arrow-up-right-from-square me-2"></i> Mağazada
                    Görüntüle</a>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="col">
          <!-- Failed Addon Card -->
          <div class="card border border-danger border-3 h-100">
            <div class="card-body">
              <div class="row h-100">
                <div class="col-md-4 d-md-flex d-none">
                  <a href="/panel/addons/detail">
                    <img
                      src="https://bitcoin.org/img/home/bitcoin-img.svg"
                      class="img-thumbnail animate__animated animate__zoomIn"
                      alt="Bitcoin Payment" />
                  </a>
                </div>
                <div class="col">
                  <div class="row">
                    <div class="col">
                      <a href="/panel/addons/detail">
                        <h5 class="card-title">Bitcoin Payment</h5>
                      </a>
                    </div>
                    <div class="col-auto">
                      <div class="form-check form-switch">
                        <input
                          class="form-check-input"
                          type="checkbox"
                          role="switch"
                          id="failedAddonStatusSwitch" />
                        <label
                          class="form-check-label"
                          for="failedAddonStatusSwitch">Devre Dışı</label>
                      </div>
                    </div>
                    <div class="col-auto">
                      <a
                        href="#"
                        tabindex="0"
                        class="link-danger"
                        data-bs-toggle="popover"
                        data-bs-trigger="focus"
                        data-bs-custom-class="font-monospace"
                        data-bs-title="Error Log"
                        data-bs-content="ReferenceError: CardMenu is not defined
                        at Object.middle (C:/Users/selim/Projeler/PanoCMS/panel-ui/src/lib/pages/posts/PostCategories.svelte:158:55)        
                        at C:\Users\selim\Projeler\PanoCMS\panel-ui\src\lib\component\PageActions.svelte:5:241
                        at Object.$$render (C:\Users\selim\Projeler\PanoCMS\panel-ui\node_modules\svelte\src\runtime\internal\ssr.js:156:16)
                        at eval (C:/Users/selim/Projeler/PanoCMS/panel-ui/src/lib/pages/posts/PostCategories.svelte:156:129)
                        at Object.$$render (C:\Users\selim\Projeler\PanoCMS\panel-ui\node_modules\svelte\src\runtime\internal\ssr.js:156:16)
                        at eval (C:/Users/selim/Projeler/PanoCMS/panel-ui/src/routes/posts/categories/+page.svelte:13:102)
                        at Object.$$render (C:\Users\selim\Projeler\PanoCMS\panel-ui\node_modules\svelte\src\runtime\internal\ssr.js:156:16)
                        at Object.default (C:\Users\selim\Projeler\PanoCMS\panel-ui\.svelte-kit\generated\root.svelte:54:44)
                        at Object.default (C:/Users/selim/Projeler/PanoCMS/panel-ui/src/routes/posts/+layout.svelte:13:43)
                        at eval (C:/Users/selim/Projeler/PanoCMS/panel-ui/src/lib/layouts/PostsLayout.svelte:26:41)
                    missing-declaration">
                        <i class="fa-solid fa-circle-exclamation fa-1x"></i>
                      </a>
                    </div>
                  </div>
                  <small class="text-muted">
                    Yapımcı: <a href="/" target="_blank">Kahverengi</a>
                    <div class="vr mx-2"></div>
                    <span class="font-monospace">local-build</span>
                    <div class="vr mx-2"></div>
                    <span class="text-success">
                      <i class="fa-regular fa-circle-check me-1"></i> Onaylandı
                    </span>
                  </small>
                  <p class="pt-2">
                    Lorem ipsum dolor sit amet consectetur, adipisicing elit.
                    Ipsam id amet soluta aspernatur beatae culpa, modi ab
                    consectetur...
                  </p>
                  <a href="#" target="_blank" class="card-link">
                    <i class="fa-solid fa-arrow-up-right-from-square me-2"></i> Kaynak</a>
                  <a href="#" target="_blank" class="card-link">
                    <i class="fa-solid fa-arrow-up-right-from-square me-2"></i> Mağazada
                    Görüntüle</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

<script>
  import { getContext } from "svelte";
  import PageActions from "$lib/component/PageActions.svelte";
  import CardHeader from "$lib/component/CardHeader.svelte";
  import CardFiltersItem from "$lib/component/CardFiltersItem.svelte";
  import CardFilters from "$lib/component/CardFilters.svelte";
  import AddPluginModal, {
    show as showAddPluginModal,
  } from "$lib/component/modals/AddPluginModal.svelte";

  const pageTitle = getContext("pageTitle");

  pageTitle.set("Eklentiler");
</script>
