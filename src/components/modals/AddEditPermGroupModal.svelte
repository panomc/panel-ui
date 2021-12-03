<!-- Add / Edit Permission Group Modal -->
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
          {$mode === "edit" ? "Yetki Grubu Düzenle" : "Yetki Grubu Ekle"}
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
            <label for="name">Yetki Grubu Adı:</label>
            <input
              class="form-control"
              id="name"
              type="text"
              bind:value="{$permissionGroup.name}"
              class:border-danger="{$errors.name}"
            />
          </div>
        </div>
        <div class="modal-footer">
          <button
            class="btn btn-block"
            class:btn-secondary="{$mode === 'create'}"
            class:btn-primary="{$mode === 'edit'}"
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
  import jquery from "jquery";
  import { writable, get } from "svelte/store";

  const dialogID = "addEditPermissionGroup";
  const mode = writable("create");
  const permissionGroup = writable({});
  const errors = writable([]);

  let callback = (permissionGroup) => {};
  let hideCallback = (permissionGroup) => {};

  export function show(newMode, newPermissionGroup = { id: -1, name: "" }) {
    mode.set(newMode);

    permissionGroup.set(newPermissionGroup);
    errors.set([]);

    jquery("#" + dialogID).modal({ backdrop: "static", keyboard: false });
  }

  export function hide() {
    if (get(mode) === "edit") hideCallback(get(permissionGroup));

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
  import { session } from "$app/stores";

  import { showNetworkErrorOnCatch } from "$lib/store";
  import ApiUtil from "$lib/api.util";

  let loading = false;

  function onSubmit() {
    loading = true;

    showNetworkErrorOnCatch((resolve, reject) => {
      ApiUtil.post({
        path:
          "/api/panel/permission/" +
          (get(mode) === "edit" ? "update" : "add") +
          "/group",
        body: get(permissionGroup),
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
