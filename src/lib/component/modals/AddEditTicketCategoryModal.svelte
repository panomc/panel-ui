<!-- Add / Edit Ticket Category Modal -->
<div class="modal fade" id="{dialogID}" role="dialog" tabindex="-1">
  <div class="modal-dialog modal-dialog-centered" role="dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title">
          {$mode === "edit" ? "Kategoriyi Düzenle" : "Kategori Ekle"}
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
              class="form-control mb-3"
              placeholder="Başlık"
              id="category"
              type="text"
              bind:value="{$category.title}"
              class:border-danger="{$errors.title}"
            />
          <textarea
            class="form-control"
            class:border-danger="{$errors.description}"
            placeholder="Açıklama"
            id="categoryDescription"
            type="text"
            rows="5"
            bind:value="{$category.description}"></textarea>
        </div>
        <div class="modal-footer">
          <button
            class="btn w-100"
            type="submit"
            class:btn-secondary="{$mode === 'create'}"
            class:btn-primary="{$mode === 'edit'}"
            class:disabled="{loading}"
            disabled="{loading}"
          >
            {$mode === "edit" ? "Kaydet" : "Oluştur"}
          </button>
        </div>
      </form>
    </div>
  </div>
</div>

<script context="module">
  import { writable, get } from "svelte/store";

  const dialogID = "addEditTicketCategory";
  const mode = writable("create");
  const category = writable({});
  const errors = writable([]);

  let callback = (routeFirstPage) => {};
  let hideCallback = (category) => {};
  let modal;

  export function show(
    newMode,
    newCategory = { id: -1, title: "", description: "" }
  ) {
    mode.set(newMode);

    if (newCategory.description === null) newCategory.description = "";

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
  import { session } from "$app/stores";

  import { showNetworkErrorOnCatch } from "$lib/store";
  import ApiUtil from "$lib/api.util";

  let loading = false;

  function onSubmit() {
    loading = true;

    showNetworkErrorOnCatch((resolve, reject) => {
      const bodyHandler = (body) => {
        if (body.result === "ok") {
          loading = false;

          hide();

          callback(true);

          resolve();
        } else if (body.result === "error") {
          loading = false;

          errors.set(body.error);

          resolve();
        } else reject();
      }

      if (get(mode) === "edit") {
        ApiUtil.put({
          path:
            `/api/panel/ticket/categories/${get(category).id}`,
          body: get(category),
          CSRFToken: $session.CSRFToken,
        })
          .then(bodyHandler)
          .catch(() => {
            reject();
          });

        return
      }

      ApiUtil.post({
        path:
          "/api/panel/ticket/category",
        body: get(category),
        CSRFToken: $session.CSRFToken,
      })
        .then(bodyHandler)
        .catch(() => {
          reject();
        });
    });
  }
</script>
