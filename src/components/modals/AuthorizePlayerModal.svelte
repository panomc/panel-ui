<!-- Authorize Player Modal -->
<div
  class="modal fade"
  id="{dialogID}"
  tabindex="-1"
  aria-labelledby="exampleModalLabel"
  aria-hidden="true">
  <div class="modal-dialog modal-dialog-centered">
    <div class="modal-content">
      {#if $loading}
        <div class="modal-body">
          <div class="text-center">
            <div class="spinner-border text-primary" role="status">
              <span class="sr-only">Loading...</span>
            </div>
          </div>
        </div>
      {:else}
        <div class="modal-header">
          <h5 class="modal-title" id="exampleModalLabel">
            Oyuncuyu Yetkilendir
          </h5>
          <button
            type="button"
            class="close"
            on:click="{hide}"
            aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <label for="exampleFormControlSelect1">Yetki grubu seç</label>
            <select
              class="form-control"
              class:border-danger="{$errors['LAST_ADMIN']}"
              id="exampleFormControlSelect1"
              bind:value="{$player.permission_group}">
              <option class="text-primary" value="-">Oyuncu</option>

              {#each $permissionGroups as permissionGroup, index (permissionGroup)}
                <option value="{permissionGroup.name}"
                  >{permissionGroup.name}</option>
              {/each}
            </select>
            {#if $errors["LAST_ADMIN"]}
              <small class="text-danger">
                <i aria-hidden="true" class="fa fa-exclamation-circle fa-fw"
                ></i>
                Bu kullanıcının yetkisi son yönetici olduğu için değiştirilemez.
              </small>
            {/if}
          </div>
        </div>
        <div class="modal-footer">
          <button
            type="button"
            class="btn btn-primary"
            class:disabled="{$submitLoading}"
            disabled="{$submitLoading}"
            on:click="{onSubmit}">Kaydet</button>
        </div>
      {/if}
    </div>
  </div>
</div>

<script context="module">
  import jquery from "jquery";
  import { writable, get } from "svelte/store";

  import { showNetworkErrorOnCatch } from "../../Store";
  import ApiUtil from "../../pano-ui/js/api.util";

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

  export function show(newPlayer) {
    player.set(Object.assign({}, newPlayer));
    errors.set(defaultErrors);
    submitLoading.set(false);

    initData();

    jquery("#" + dialogID).modal({ backdrop: "static", keyboard: false });
  }

  export function hide() {
    if (!get(loading)) {
      hideCallback(get(player));

      jquery("#" + dialogID).modal("hide");
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
      ApiUtil.get("panel/permission/groups")
        .then((response) => {
          if (response.data.result === "ok") {
            permissionGroups.set(response.data.permissionGroups);
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
  function refreshBrowserPage() {
    location.reload();
  }

  function onSubmit() {
    submitLoading.set(true);

    showNetworkErrorOnCatch((resolve, reject) => {
      ApiUtil.post("panel/player/set/permissionGroup", get(player))
        .then((response) => {
          if (response.data.result === "ok") {
            submitLoading.set(false);

            hide();

            callback(get(player));

            resolve();
          } else if (response.data.result === "NOT_EXISTS") {
            refreshBrowserPage();
          } else if (!!response.data.error) {
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
