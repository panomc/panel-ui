<script context="module">
  import jquery from "jquery";
  import { writable, get } from "svelte/store";

  const dialogID = "addEditTicketCategory";
  const mode = writable("create");
  const category = writable({});
  const errors = writable([]);
  let callback = (routeFirstPage) => {};

  export function show(
    newMode,
    newCategory = { id: -1, title: "", description: "" }
  ) {
    mode.set(newMode);

    if (newCategory.description === null)
      newCategory.description = ""

    category.set(newCategory);
    errors.set([]);

    jquery("#" + dialogID).modal("show");
  }

  export function hide() {
    jquery("#" + dialogID).modal("hide");
  }

  export function setCallback(newCallback) {
    callback = newCallback;
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
        "panel/ticket/category/" + (get(mode) === "edit" ? "update" : "add"),
        get(category)
      )
        .then((response) => {
          if (response.data.result === "ok") {
            loading = false;

            hide();

            callback(true);

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
</script>

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
          {$mode === 'edit' ? 'Kategoriyi Düzenle' : 'Kategori Ekle'}
        </h5>

        <button
          aria-label="Kapat"
          class="close"
          data-dismiss="modal"
          title="Pencereyi Kapat"
          type="button"
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
            <input
              class="form-control"
              id="categoryDescription"
              type="text"
              bind:value="{$category.description}"
              class:border-danger="{$errors.description}"
            />
          </div>
        </div>
        <div class="modal-footer">
          <button
            class="btn btn-block btn-secondary"
            type="submit"
            class:disabled="{loading}"
            disabled="{loading}"
          >
            {$mode === 'edit' ? 'Kaydet' : 'Oluştur'}
          </button>
        </div>
      </form>
    </div>
  </div>
</div>
