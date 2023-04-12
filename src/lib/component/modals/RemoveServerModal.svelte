<!-- Confirm Remove Server Modal -->
<div
  aria-hidden="true"
  class="modal fade"
  id="{dialogID}"
  role="dialog"
  tabindex="-1">
  <div class="modal-dialog modal-dialog-centered" role="dialog">
    <div class="modal-content">
      <form>
        <div class="modal-body text-center">
          <div class="pb-3">
            <i class="fas fa-question-circle fa-3x d-block m-auto text-gray"
            ></i>
          </div>
          Bu sunucuyu kaldırmak istediğinizden emin misiniz?

          <input
            class="form-control d-inline-block text-center mt-3"
            placeholder="Hesap Şifresi"
            type="password"
            bind:value="{$currentPassword}"
            class:border-danger="{$passwordError}" />
        </div>

        <div class="modal-footer flex-nowrap">
          <button class="btn btn-link col-6 m-0" type="button" on:click="{hide}"
            >İptal</button>
          <button
            class="btn btn-danger col-6 m-0"
            type="button"
            disabled="{confirmButtonDisabled}"
            class:disabled="{confirmButtonDisabled}"
            on:click="{sendDeleteServer}">Evet</button>
        </div>
      </form>
    </div>
  </div>
</div>

<script context="module">
  import { writable } from "svelte/store";

  const dialogID = "confirmRemoveServer";

  let callback = () => {};
  let hideCallback = () => {};
  let modal;

  const server = writable({});
  const loading = writable(false);
  const passwordError = writable(false);
  const currentPassword = writable("");

  export function show(newServer) {
    modal = new window.bootstrap.Modal(document.getElementById(dialogID), {
      backdrop: "static",
      keyboard: false,
    });

    loading.set(false);
    server.set(newServer);
    passwordError.set(false);
    currentPassword.set("");

    modal.show();
  }

  export function hide() {
    hideCallback();

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
  import { invalidateAll } from "$app/navigation";

  import { showNetworkErrorOnCatch } from "$lib/Store.js";
  import ApiUtil from "$lib/api.util";

  import { show as showToast } from "$lib/component/ToastContainer.svelte";
  import ServerDeletedSuccessToast from "$lib/component/toasts/ServerDeletedSuccessToast.svelte";

  $: confirmButtonDisabled = $currentPassword.length === 0;

  function sendDeleteServer() {
    $loading = true;

    showNetworkErrorOnCatch((resolve, reject) => {
      ApiUtil.post({
        path: `/api/panel/servers/${$server.id}/delete`,
        body: { currentPassword: $currentPassword },
      })
        .then(async (body) => {
          if (body.result === "ok") {
            callback($server);
            await invalidateAll();
            hide();
            showToast(ServerDeletedSuccessToast, { name: $server.name });
          } else if (body.error) {
            if (body.error === "CURRENT_PASSWORD_NOT_CORRECT") {
              $passwordError = true;
            } else {
              location.reload();
            }
          } else reject();
        })
        .catch(() => {
          reject();
        });
    });
  }
</script>
