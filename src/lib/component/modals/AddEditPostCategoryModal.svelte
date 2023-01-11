<!-- Add / Edit Category Modal -->
<div class="modal fade" id="{dialogID}" role="dialog" tabindex="-1">
  <div class="modal-dialog modal-dialog-centered" role="dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title">
          {$mode === "create" ? "Kategori Oluştur" : "Kategoriyi Düzenle"}
        </h5>
        <button
          title="Pencereyi Kapat"
          type="button"
          class="btn-close"
          data-bs-dismiss="modal"
          on:click="{hide}"></button>
      </div>
      <form on:submit|preventDefault="{onSubmit}">
        <div class="modal-body">
          <input
            class:border-danger="{$errors.title}"
            class="form-control form-control-lg border-0 text-black p-0 mb-3"
            placeholder="Başlık"
            id="category"
            type="text"
            bind:value="{$category.title}"
            on:input="{() => setURL()}" />
          <textarea
            class:border-danger="{$errors.description}"
            class="form-control mb-3"
            placeholder="Açıklama"
            id="categoryDescription"
            type="text"
            rows="5"
            bind:value="{$category.description}"></textarea>
          <div class="mb-3 input-group">
            <span class="input-group-text">/category/</span>
            <input
              class="form-control"
              placeholder="URL"
              id="categoryURL"
              type="text"
              class:is-invalid="{$errors.url}"
              bind:value="{$category.url}" />
          </div>
          <small class:text-danger="{$errors.url}">
            Yanlızca [A-Z/a-z/0-9/-] içerebilir ve minimum 3, maksimum 32
            karkater olabilir.
          </small>
        </div>
        <div class="modal-footer">
          <button
            class="btn w-100"
            type="submit"
            class:btn-secondary="{$mode === 'create'}"
            class:btn-primary="{$mode === 'edit'}"
            class:disabled="{loading || buttonDisabled}">
            <span>
              {#if $mode === "edit"}
                Kaydet
              {:else}
                Oluştur
              {/if}
            </span>
          </button>
        </div>
      </form>
    </div>
  </div>
</div>

<script context="module">
  import { writable, get } from "svelte/store";

  const dialogID = "postCategoriesAddEditCategory";
  const mode = writable("create");
  const category = writable({});
  const errors = writable([]);

  let callback = (routeFirstPage, category) => {};
  let hideCallback = (category) => {};
  let modal;

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

    modal = new window.bootstrap.Modal(document.getElementById(dialogID), {
      backdrop: "static",
      keyboard: false,
    });
    modal.show();
  }

  export function hide() {
    if (get(mode) === "edit") hideCallback(get(category));

    modal.hide();
  }

  export function setCallback(newCallback) {
    callback = newCallback;
  }

  export function onHide(newCallback) {
    hideCallback = newCallback;
  }
</script>

<script>
  import { showNetworkErrorOnCatch } from "$lib/Store";
  import ApiUtil from "$lib/api.util";

  let loading = false;
  $: buttonDisabled = !$category.title;

  function onSubmit() {
    loading = true;

    showNetworkErrorOnCatch((resolve, reject) => {
      console.log("geldi");
      const bodyHandler = (body) => {
        if (body.result === "ok") {
          loading = false;

          hide();

          const newCategory = get(category);

          newCategory.id = body.id;

          callback(true, newCategory);

          resolve();
        } else if (body.result === "errors") {
          loading = false;

          errors.set(body.errors);

          resolve();
        } else if (body.result === "error") reject();
      };

      if (get(mode) === "edit") {
        ApiUtil.put({
          path: `/api/panel/post/categories/${get(category).id}`,
          body: get(category),
        })
          .then(bodyHandler)
          .catch(() => {
            reject();
          });

        return;
      }

      ApiUtil.post({
        path: "/api/panel/post/category",
        body: get(category),
      })
        .then(bodyHandler)
        .catch(() => {
          reject();
        });
    });
  }

  function setURL() {
    category.update((category) => {
      category.url = category.title
        .replace(/\s+/g, "-")
        .replace(/[^0-9A-Za-z-]+/g, "")
        .toLowerCase()
        .substring(0, 32);

      return category;
    });
  }
</script>
