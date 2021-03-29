<script context="module">
  import jquery from "jquery";
  import { writable, get } from "svelte/store";

  const dialogID = "postCategoriesAddEditCategory";
  const mode = writable("create");
  const category = writable({});
  const errors = writable([]);

  let callback = (routeFirstPage, category) => {};
  let hideCallback = (category) => {};

  export function show(
    newMode,
    newCategory = {
      id: -1,
      title: "",
      description: "",
      url: "",
      color: "#1976d2",
    }
  ) {
    mode.set(newMode);

    newCategory = Object.assign({}, newCategory);

    if (newCategory.color && !newCategory.color.includes("#"))
      newCategory.color = "#" + newCategory.color;

    category.set(newCategory);
    errors.set([]);

    jquery("#" + dialogID).modal({ backdrop: "static", keyboard: false });
  }

  export function hide() {
    if (get(mode) === "edit") hideCallback(get(category));

    jquery("#" + dialogID).modal("hide");
  }

  export function setCallback(newCallback) {
    callback = newCallback;
  }

  export function onHide(newCallback) {
    hideCallback = newCallback;
  }
</script>

<script>
  import { showNetworkErrorOnCatch } from "../../Store";
  import ApiUtil from "../../pano/js/api.util";

  let loading = false;

  function onSubmit() {
    loading = true;

    showNetworkErrorOnCatch((resolve, reject) => {
      ApiUtil.post(
        "panel/post/category/" + (get(mode) === "edit" ? "update" : "add"),
        get(category)
      )
        .then((response) => {
          if (response.data.result === "ok") {
            loading = false;

            hide();

            const newCategory = get(category);

            newCategory.id = response.data.id;

            callback(true, newCategory);

            resolve();
          } else if (response.data.result === "error") {
            loading = false;

            errors.set(response.data.error);

            resolve();
          } else reject();
        })
        .catch(() => {
          reject();
        });
    });
  }

  function setURL() {
    category.update((category) => {
      category.url = category.title.replace(/\s+/g, '-').replace(/[^0-9A-Za-z-]+/g, "").toLowerCase()

      return category
    });
  }
</script>

<!-- Add / Edit Category Modal -->
<div
  aria-hidden="true"
  class="modal fade"
  id="{dialogID}"
  role="dialog"
  tabindex="-1">
  <div class="modal-dialog modal-dialog-centered" role="dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title">
          {$mode === "create" ? "Kategori Oluştur" : "Kategoriyi Düzenle"}
        </h5>

        <button
          aria-label="Kapat"
          class="close"
          title="Pencereyi Kapat"
          type="button"
          on:click="{hide}">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <form on:submit|preventDefault="{onSubmit}">
        <div class="modal-body">
          <div class="form-group">
            <input
              class:border-danger="{$errors.title}"
              class="form-control"
              placeholder="Kategori"
              id="category"
              type="text"
              bind:value="{$category.title}"
            on:input={() => setURL()}/>
          </div>
          <div class="form-group">
            <textarea
              class:border-danger="{$errors.description}"
              class="form-control"
              placeholder="Açıklama"
              id="categoryDescription"
              type="text"
              rows="5"
              bind:value="{$category.description}"></textarea>
          </div>
          <div class="form-group">
            <div class="input-group input-group-sm shadow-0">
              <div class="input-group-prepend bg-lightprimary shadow-0">
                <span class="input-group-text">/category/</span>
              </div>
              <input
                class:border-danger="{$errors.url}"
                class="form-control"
                placeholder="..."
                id="categoryURL"
                type="text"
                bind:value="{$category.url}" />
            </div>
            <small class:text-danger="{$errors.url}">
              <i aria-hidden="true" class="fa fa-exclamation-circle fa-fw"></i>
              Yanlızca [A-Z/a-z/0-9/-] içerebilir ve minimum 3, maksimum 32 karkater
              olabilir.
            </small>
          </div>
          <div class="form-group d-none">
            <label for="categoryColor">Renk:</label>
            <div class="input-group">
              <input
                class="form-control rounded-pill"
                id="categoryColor"
                type="color"
                bind:value="{$category.color}" />
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button
            class="btn btn-block"
            type="submit"
            class:btn-secondary="{$mode === 'create'}"
            class:btn-primary="{$mode === 'edit'}"
            class:disabled="{loading}"
            disabled="{loading}">
            <span>
              {#if $mode === "edit"}
                <i aria-hidden="true" class="fa fa-save fa-fw"></i>
                Kaydet
              {:else}
                <i aria-hidden="true" class="fa fa-plus fa-fw"></i>
                Oluştur
              {/if}
            </span>
          </button>
        </div>
      </form>
    </div>
  </div>
</div>
