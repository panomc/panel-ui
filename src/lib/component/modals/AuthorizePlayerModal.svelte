<!-- Authorize Player Modal -->
<div class="modal fade" id="{dialogID}" tabindex="-1" aria-hidden="true">
  <div class="modal-dialog modal-dialog-centered">
    <div class="modal-content">
      {#if $loading}
        <div class="modal-body">
          <div class="text-center">
            <div class="spinner-border text-primary" role="status"></div>
          </div>
        </div>
      {:else}
        <div class="modal-header">
          <h5 class="modal-title" id="exampleModalLabel">
            Oyuncuyu Yetkilendir
          </h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Kapat"
            on:click="{hide}"></button>
        </div>
        <div class="modal-body">
          <select
            class="form-control"
            class:border-danger="{$errors['LAST_ADMIN']}"
            id="selectPermGroup"
            bind:value="{$player.permissionGroup}">
            <option class="text-primary" value="-">Oyuncu</option>

            {#each $permissionGroups as permissionGroup, index (permissionGroup)}
              <option value="{permissionGroup.name}"
                >{permissionGroup.name}</option>
            {/each}
          </select>
          {#if $errors["LAST_ADMIN"]}
            <small class="text-danger">
              <i aria-hidden="true" class="fa fa-exclamation-circle"></i>
              Bu kullanıcının yetkisi son yönetici olduğu için değiştirilemez.
            </small>
          {/if}
        </div>
        <div class="modal-footer">
          <button
            type="button"
            class="btn btn-primary w-100"
            class:disabled="{$submitLoading}"
            disabled="{$submitLoading}"
            on:click="{onSubmit}">Kaydet</button>
        </div>
      {/if}
    </div>
  </div>
</div>

<script context="module">
  import { writable, get } from "svelte/store";

  import { showNetworkErrorOnCatch } from "$lib/Store";
  import ApiUtil from "$lib/api.util";

  const dialogID = "authorizePlayerModal";
  const player = writable({});
  const loading = writable(true);
  const permissionGroups = writable([]);
  const defaultErrors = {
    "LAST_ADMIN": false,
  };
  const errors = writable(defaultErrors);
  const submitLoading = writable(false);

  let callback = (player) => {};
  let hideCallback = (player) => {};
  let modal;

  export function show(newPlayer) {
    player.set(Object.assign({}, newPlayer));
    errors.set(defaultErrors);
    submitLoading.set(false);

    initData();

    modal = new window.bootstrap.Modal(document.getElementById(dialogID), {
      backdrop: "static",
      keyboard: false,
    });
    modal.show();
  }

  export function hide() {
    if (!get(loading)) {
      hideCallback(get(player));

      modal.hide();
    }
  }

  export function setCallback(newCallback) {
    callback = newCallback;
  }

  export function onHide(newCallback) {
    hideCallback = newCallback;
  }

  function initData() {
    loading.set(true);

    showNetworkErrorOnCatch((resolve, reject) => {
      ApiUtil.get({
        path: "/api/panel/permissionGroups",
      })
        .then((body) => {
          if (body.result === "ok") {
            permissionGroups.set(body.permissionGroups);
            loading.set(false);

            resolve();
          } else reject();
        })
        .catch(() => {
          reject();
        });
    });
  }
</script>

<script>
  import { show as showToast } from "$lib/component/ToastContainer.svelte";
  import PlayerAuthorizedSuccessToast from "$lib/component/toasts/PlayerAuthorizedSuccessToast.svelte";

  function refreshBrowserPage() {
    location.reload();
  }

  function onSubmit() {
    submitLoading.set(true);

    showNetworkErrorOnCatch((resolve, reject) => {
      ApiUtil.put({
        path: `/api/panel/players/${get(player).username}/permissionGroup`,
        body: {
          permissionGroup: get(player).permissionGroup,
        },
      })
        .then((body) => {
          if (body.result === "ok") {
            submitLoading.set(false);

            hide();

            showToast(PlayerAuthorizedSuccessToast);

            callback(get(player));

            resolve();
          } else if (body.result === "NOT_EXISTS") {
            refreshBrowserPage();
          } else if (body.error) {
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
