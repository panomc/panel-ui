<!-- Add / Edit Permission Group Modal -->
<div aria-hidden="true" class="modal fade" id="{dialogID}" tabindex="-1">
  <div
    class="modal-dialog modal-dialog-centered modal-lg modal-dialog-scrollable">
    <div class="modal-content">
      {#if $gettingData}
        <div class="modal-body">
          <div class="text-center">
            <div class="spinner-border text-primary" role="status"></div>
          </div>
        </div>
      {:else}
        <div class="modal-header">
          <h5 class="modal-title">
            {$mode === "edit" ? "Yetki Grubu Düzenle" : "Yetki Grubu Ekle"}
          </h5>
          <button
            title="Pencereyi Kapat"
            type="button"
            class="btn-close"
            on:click="{hide}"></button>
        </div>
        <div class="modal-body">
          <input
            class:text-danger="{$errors.name}"
            class:text-black="{!$errors.name}"
            class="form-control form-control-lg border-0 text-black p-0 mb-3"
            placeholder="İsim"
            id="permName"
            type="text"
            bind:value="{$permissionGroup.name}" />
          {#if $errors.error}
            <small class="text-danger">
              {$errors.error}
            </small>
          {/if}
          <form on:submit|preventDefault="{addUser}">
            <label for="addPlayerInput" class="form-label">Oyuncu Ekle</label>
            <input
              class="form-control mb-3"
              id="addPlayerInput"
              bind:value="{$username}"
              class:border-danger="{$usernameInputError}"
              class:disabled="{$checkingUsername}"
              placeholder="Eklemek için Enter'a basın" />
          </form>

          {#each $permissionGroup.users as user, index (user)}
            <a
              use:tooltip="{['Kaldır', { placement: 'bottom' }]}"
              href="javascript:void(0);"
              on:click="{() => removeUser(index)}">
              <span
                class="badge rounded-pill bg-light link-primary text-center">
                <img
                  class="d-inline rounded-circle me-2"
                  src="https://crafthead.net/avatar/{user}"
                  alt="{user}"
                  width="28"
                  height="28" />
                {user}
              </span>
            </a>
          {/each}
        </div>
        <div class="modal-footer">
          <button
            class="btn w-100"
            class:btn-secondary="{$mode === 'create'}"
            class:btn-primary="{$mode === 'edit'}"
            type="submit"
            class:disabled="{loading || !$permissionGroup.name}"
            disabled="{loading || !$permissionGroup.name}"
            on:click="{onSubmit}">
            {$mode === "edit" ? "Kaydet" : "Oluştur"}
          </button>
        </div>
      {/if}
    </div>
  </div>
</div>

<script context="module">
  import { writable, get } from "svelte/store";
  import tooltip from "$lib/tooltip.util";
  import { showNetworkErrorOnCatch } from "$lib/Store.js";
  import ApiUtil from "../../../pano-ui/js/api.util.js";

  const dialogID = "addEditPermissionGroup";
  const mode = writable("create");
  const permissionGroup = writable({});
  const errors = writable([]);
  const gettingData = writable(true);
  const checkingUsername = writable(false);
  let originalUsers = [];
  const username = writable("");
  const usernameInputError = writable(false);
  let addedUsers = [];
  let removedUsers = [];

  let callback = (permissionGroup) => {};
  let hideCallback = (permissionGroup) => {};
  let modal;

  export function show(newMode, newPermissionGroup = { id: -1, name: "" }) {
    mode.set(newMode);

    permissionGroup.set(newPermissionGroup);
    errors.set([]);
    username.set("");
    usernameInputError.set(false);
    checkingUsername.set(false);
    addedUsers = [];
    removedUsers = [];
    gettingData.set(false);
    originalUsers = [];

    if (get(mode) === "edit") {
      initData();
    } else {
      permissionGroup.update((permissionGroup) => {
        permissionGroup.users = [];

        return permissionGroup;
      });
    }

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

  function initData() {
    gettingData.set(true);

    showNetworkErrorOnCatch((resolve, reject) => {
      ApiUtil.get({
        path: `/api/panel/permissionGroups/${get(permissionGroup).id}`,
      })
        .then((body) => {
          if (body.result === "ok") {
            permissionGroup.set(body);
            originalUsers = [...body.users];
            gettingData.set(false);

            resolve();

            return;
          }

          reject();
        })
        .catch(() => {
          reject();
        });
    });
  }
</script>

<script>
  import { session } from "$lib/Store";

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
            errors.set(
              typeof body.error === "string"
                ? { error: body.error }
                : body.error
            );
          }

          resolve();
        } else reject();
      };

      if (get(mode) === "edit") {
        ApiUtil.put({
          path: `/api/panel/permissionGroups/${get(permissionGroup).id}`,
          body: { ...$permissionGroup, addedUsers, removedUsers },
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
        body: { ...$permissionGroup, addedUsers },
        CSRFToken: $session.CSRFToken,
      })
        .then(bodyHandler)
        .catch(() => {
          reject();
        });
    });
  }

  async function addUser() {
    errors.set([]);

    if (!$username) {
      return;
    }

    if ($permissionGroup.users.indexOf($username) !== -1) {
      usernameInputError.set(true);

      return;
    }

    checkingUsername.set(true);

    showNetworkErrorOnCatch((resolve, reject) => {
      ApiUtil.get({
        path: `/api/panel/players/${$username}/exists`,
      })
        .then((body) => {
          checkingUsername.set(false);
          resolve();

          if (body.result === "ok") {
            usernameInputError.set(false);

            permissionGroup.update((permissionGroup) => {
              permissionGroup.users.push($username);

              return permissionGroup;
            });

            if (removedUsers.indexOf($username) !== -1) {
              removedUsers.remove(removedUsers.indexOf($username));
            }

            if (originalUsers.indexOf($username) === -1) {
              addedUsers.push($username);
            }

            username.set("");

            return;
          }

          errors.set({ error: body.error });
          usernameInputError.set(true);
        })
        .catch(() => reject());
    });
  }

  function removeUser(index) {
    const username = $permissionGroup.users[index];

    permissionGroup.update((permissionGroup) => {
      permissionGroup.users = permissionGroup.users.remove(index);

      return permissionGroup;
    });

    if (addedUsers.indexOf(username) !== -1) {
      addedUsers.remove(addedUsers.indexOf(username));
    }

    if (originalUsers.indexOf(username) !== -1) {
      removedUsers.push(username);
    }
  }
</script>
