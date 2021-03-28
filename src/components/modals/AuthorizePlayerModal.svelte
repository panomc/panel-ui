<script context="module">
  import jquery from "jquery";
  import { writable, get } from "svelte/store";

  import { showNetworkErrorOnCatch } from "../../Store";
  import ApiUtil from "../../pano/js/api.util";

  const dialogID = "authorizePlayerModal";
  const player = writable({});
  const loading = writable(true);
  const permissionGroups = writable([]);

  let callback = (player) => {};
  let hideCallback = (player) => {};

  export function show(newPlayer) {
    player.set(newPlayer);

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
  let submitLoading = false;

  function refreshBrowserPage() {
    location.reload();
  }

  function onSubmit() {
    submitLoading = true;

    showNetworkErrorOnCatch((resolve, reject) => {
      ApiUtil.post("panel/player/set/permissionGroup", get(player))
        .then((response) => {
          if (response.data.result === "ok") {
            submitLoading = false;

            hide();

            callback(get(player));

            resolve();
          } else if (response.data.result === "NOT_EXISTS") {
            refreshBrowserPage();
          } else reject();
        })
        .catch(() => {
          reject();
        });
    });
  }
</script>

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
              id="exampleFormControlSelect1"
              bind:value="{$player.permissionGroup}">
              <option class="text-primary" value="-">Oyuncu</option>

              {#each $permissionGroups as permissionGroup, index (permissionGroup)}
                <option value="{permissionGroup.name}"
                  >{permissionGroup.name}</option>
              {/each}
            </select>
          </div>
        </div>
        <div class="modal-footer">
          <button
            type="button"
            class="btn btn-primary"
            class:disabled="{submitLoading}"
            disabled="{submitLoading}"
            on:click="{onSubmit}">Kaydet</button>
        </div>
      {/if}
    </div>
  </div>
</div>
