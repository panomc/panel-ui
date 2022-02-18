<!-- Permission Group Delete Confirmation Modal -->
<div
  aria-hidden="true"
  class="modal fade"
  id="{dialogID}"
  role="dialog"
  tabindex="-1"
>
  <div class="modal-dialog modal-dialog-centered" role="dialog">
    <div class="modal-content">
      <div class="modal-body text-center">
        <div class="pb-3">
          <i class="fas fa-question-circle fa-3x d-block m-auto text-gray"></i>
        </div>
        Bu yetki grubunu kalıcı olarak silmek istediğinizden emin misiniz?

        {#if $permissionGroup.user_count > 0}
          <div class="mt-3 alert alert-warning">
            Yetki grubu içerisindeki şu kullanıcılar Oyuncu olarak değişecek:
            <br />
            <br />
            <span class="badge bg-warning rounded-pill mr-1">
              {$permissionGroup.name}
            </span>
            <div
              class="d-flex flex-row flex-row-reverse justify-content-center align-items-center mt-3 mr-3"
            >
              {#if $permissionGroup.user_count > 3}
                <small class="pl-1">+{$permissionGroup.user_count - 3}</small>
              {/if}

              {#each $permissionGroup.users as user, index (user)}
                <span
                  class="overlapping-avatar"
                  use:tooltip="{[user, { placement: 'bottom' }]}"
                >
                  <a href="{base}/players/player/{user}">
                    <img
                      src="https://minotar.net/avatar/{user}"
                      width="32"
                      height="32"
                      alt="{user}"
                    />
                  </a>
                </span>
              {/each}
            </div>
          </div>
        {/if}
      </div>
      <div class="modal-footer">
        <button
          class="btn btn-link text-muted"
          type="button"
          class:disabled="{loading}"
          disabled="{loading}"
          on:click="{hide}"
        >
          İptal
        </button>
        <button
          class="btn btn-danger"
          type="button"
          class:disabled="{loading}"
          disabled="{loading}"
          on:click="{onYesClick}"
        >
          Evet
        </button>
      </div>
    </div>
  </div>
</div>

<script context="module">
  import { writable, get } from "svelte/store";

  const dialogID = "permissionGroupDeleteConfirmationModal";
  const permissionGroup = writable({
    id: -1,
    name: "",
    users: [],
    user_count: 0,
  });

  let callback = (permissionGroup) => {};
  let hideCallback = (permissionGroup) => {};
  let modal;

  export function show(newPermissionGroup) {
    permissionGroup.set(newPermissionGroup);

    modal = new window.bootstrap.Modal(document.getElementById(dialogID), {
      backdrop: "static",
      keyboard: false,
    });
    modal.show();
  }

  export function setCallback(newCallback) {
    callback = newCallback;
  }

  export function hide() {
    hideCallback(get(permissionGroup));

    modal.hide();
  }

  export function onHide(newCallback) {
    hideCallback = newCallback;
  }
</script>

<script>
  import { base } from "$app/paths";
  import { session } from "$app/stores";

  import { showNetworkErrorOnCatch } from "$lib/store";
  import ApiUtil from "$lib/api.util";
  import tooltip from "$lib/tooltip.util";

  let loading = false;

  function refreshBrowserPage() {
    location.reload();
  }

  function onYesClick() {
    loading = true;

    showNetworkErrorOnCatch((resolve, reject) => {
      ApiUtil.post({
        path: "/api/panel/permission/delete/group",
        body: {
          id: get(permissionGroup).id,
        },
        CSRFToken: $session.CSRFToken,
      })
        .then((body) => {
          if (body.result === "ok") {
            loading = false;

            hide();

            //TODO TOAST

            callback(get(permissionGroup));

            resolve();
          } else refreshBrowserPage();
        })
        .catch(() => {
          reject();
        });
    });
  }
</script>
