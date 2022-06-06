<!-- Add / Edit Permission Group Modal -->
<div aria-hidden="true" class="modal fade" id="{dialogID}" tabindex="-1">
  <div class="modal-dialog modal-dialog-centered">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title">
          {$mode === "edit" ? "Yetki Grubu Düzenle" : "Yetki Grubu Ekle"}
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
            class="form-control"
            placeholder="İsim"
            id="permName"
            type="text"
            bind:value="{$permissionGroup.name}"
            class:border-danger="{$errors.name}" />
          {#if $errors.error}
            <small class="text-danger">
              {$errors.error}
            </small>
          {/if}
        </div>
        <div class="modal-footer">
          <button
            class="btn w-100"
            class:btn-secondary="{$mode === 'create'}"
            class:btn-primary="{$mode === 'edit'}"
            type="submit"
            class:disabled="{loading || !$permissionGroup.name}"
            disabled="{loading || !$permissionGroup.name}">
            {$mode === "edit" ? "Kaydet" : "Oluştur"}
          </button>
        </div>
      </form>
    </div>
  </div>
</div>

<script context="module">
  import { writable, get } from "svelte/store";

  const dialogID = "addEditPermissionGroup";
  const mode = writable("create");
  const permissionGroup = writable({});
  const errors = writable([]);

  let callback = (permissionGroup) => {};
  let hideCallback = (permissionGroup) => {};
  let modal;

  export function show(newMode, newPermissionGroup = { id: -1, name: "" }) {
    mode.set(newMode);

    permissionGroup.set(newPermissionGroup);
    errors.set([]);

    modal = new window.bootstrap.Modal(document.getElementById(dialogID), {
      backdrop: "static",
      keyboard: false,
    });
    modal.show();
  }

  export function hide() {
    if (get(mode) === "edit") hideCallback(get(permissionGroup));

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
    errors.set([]);

    showNetworkErrorOnCatch((resolve, reject) => {
      const bodyHandler = (body) => {
        if (body.result === "ok") {
          loading = false;

          hide();

          callback(true);

          resolve();
        } else if (body.result === "error") {
          loading = false;

          if (body.error === "CANT_UPDATE_ADMIN_PERMISSION") {
            errors.set({ "error": body.error });
          } else {
            errors.set(body.error);
          }

          resolve();
        } else reject();
      };

      if (get(mode) == "edit") {
        ApiUtil.put({
          path: `/api/panel/permissionGroups/${get(permissionGroup).id}`,
          body: get(permissionGroup),
          CSRFToken: $session.CSRFToken,
        })
          .then(bodyHandler)
          .catch(() => {
            reject();
          });

        return;
      }

      ApiUtil.post({
        path: `/api/panel/permissionGroups`,
        body: get(permissionGroup),
        CSRFToken: $session.CSRFToken,
      })
        .then(bodyHandler)
        .catch(() => {
          reject();
        });
    });
  }
</script>
