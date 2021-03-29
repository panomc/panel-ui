<!-- Permission Group Delete Confirmation Modal -->
<div
  aria-hidden="true"
  class="modal fade"
  id="{dialogID}"
  role="dialog"
  tabindex="-1">
  <div class="modal-dialog modal-dialog-centered" role="dialog">
    <div class="modal-content">
      <div class="modal-body text-center">
        <div class="pb-3">
          <Icon
            data="{faQuestionCircle}"
            scale="3"
            class="d-block m-auto text-gray" />
        </div>
        Bu yetki grubunu kalıcı olarak silmek istediğinizden emin misiniz?

        {#if $permissionGroup.user_count > 0}
          <div class="mt-3 alert alert-warning">
            Yetki grubu içerisindeki şu kullanıcılar Oyuncu olarak değişecek:
            <br />
            <br />
            <span class="badge badge-warning badge-pill mr-1">
              {$permissionGroup.name}
            </span>
            <div
              class="d-flex flex-row flex-row-reverse justify-content-center align-items-center mt-3 mr-3">
              {#if $permissionGroup.user_count > 3}
                <small class="pl-1">+{$permissionGroup.user_count - 3}</small>
              {/if}

              {#each $permissionGroup.users as user, index (user)}
                <span
                  class="overlapping-avatar"
                  use:tooltip="{['bottom', user]}">
                  <a href="/panel/players/player/{user}">
                    <img
                      src="https://minotar.net/avatar/{user}"
                      width="32"
                      height="32"
                      alt="{user}" />
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
          on:click="{hide}">
          İptal
        </button>
        <button
          class="btn btn-danger"
          type="button"
          class:disabled="{loading}"
          disabled="{loading}"
          on:click="{onYesClick}">
          Evet
        </button>
      </div>
    </div>
  </div>
</div>

<script context="module">
  import jquery from "jquery";
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

  export function show(newPermissionGroup) {
    permissionGroup.set(newPermissionGroup);

    jquery("#" + dialogID).modal({ backdrop: "static", keyboard: false });
  }

  export function setCallback(newCallback) {
    callback = newCallback;
  }

  export function hide() {
    hideCallback(get(permissionGroup));

    jquery("#" + dialogID).modal("hide");
  }

  export function onHide(newCallback) {
    hideCallback = newCallback;
  }
</script>

<script>
  import Icon from "svelte-awesome";
  import { faQuestionCircle } from "@fortawesome/free-solid-svg-icons";

  import { showNetworkErrorOnCatch } from "../../Store";
  import ApiUtil from "../../pano-ui/js/api.util";
  import tooltip from "../../pano-ui/js/tooltip.util";

  let loading = false;

  function refreshBrowserPage() {
    location.reload();
  }

  function onYesClick() {
    loading = true;

    showNetworkErrorOnCatch((resolve, reject) => {
      ApiUtil.post("panel/permission/delete/group", {
        id: get(permissionGroup).id,
      })
        .then((response) => {
          if (response.data.result === "ok") {
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
