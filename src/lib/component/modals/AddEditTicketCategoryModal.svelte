<!-- Add / Edit Ticket Category Modal -->
<div
  aria-hidden="true"
  class="modal fade"
  id="{dialogID}"
  role="dialog"
  tabindex="-1"
>
  <div class="modal-dialog modal-dialog-centered" role="dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title">
          {$mode === "edit" ? "Kategoriyi Düzenle" : "Kategori Ekle"}
        </h5>

        <button
          aria-label="Kapat"
          class="close"
          title="Pencereyi Kapat"
          type="button"
          on:click="{hide}"
        >
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <form on:submit|preventDefault="{onSubmit}">
        <div class="modal-body">
          <div class="form-group">
            <label for="category">Kategori:</label>
            <input
              class="form-control"
              id="category"
              type="text"
              bind:value="{$category.title}"
              class:border-danger="{$errors.title}"
            />
          </div>
          <div class="form-group">
            <label for="categoryDescription">Açıklama:</label>
            <textarea
              class="form-control"
              class:border-danger="{$errors.description}"
              placeholder="Açıklama"
              id="categoryDescription"
              type="text"
              rows="5"
              bind:value="{$category.description}"></textarea>
          </div>
        </div>
        <div class="modal-footer">
          <button
            class="btn btn-block btn-secondary"
            type="submit"
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

    modal = new window.bootstrap.Modal(document.getElementById( dialogID), {backdrop: "static", keyboard: false});
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
      ApiUtil.post({
        path:
          "/api/panel/ticket/category/" +
          (get(mode) === "edit" ? "update" : "add"),
        body: get(category),
        CSRFToken: $session.CSRFToken,
      })
        .then((body) => {
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
        })
        .catch(() => {
          reject();
        });
    });
  }
</script>
