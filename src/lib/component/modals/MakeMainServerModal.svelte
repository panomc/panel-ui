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
          <i class="fas fa-question-circle fa-3x d-block m-auto text-gray"></i>
        </div>
        "{$server.name}" sunucusunu ana sunucu yapmak istediğinizden emin
        misiniz?
      </div>
      <div class="modal-footer flex-nowrap">
        <button
          class="btn btn-link link-danger col-6 m-0"
          type="button"
          class:disabled="{$loading}"
          on:click="{hide}">
          Hayır
        </button>
        <button
          class="btn btn-primary col-6 m-0"
          type="button"
          class:disabled="{$loading}"
          on:click="{acceptServer}">
          Evet
        </button>
      </div>
    </div>
  </div>
</div>

<script context="module">
  import { writable } from "svelte/store";

  const dialogID = "makeMainServerModal";

  let callback = () => {};
  let hideCallback = () => {};
  let modal;

  const server = writable({});
  const loading = writable(false);

  export function show(newServer) {
    modal = new window.bootstrap.Modal(document.getElementById(dialogID), {
      backdrop: "static",
      keyboard: false,
    });

    loading.set(false);
    server.set(newServer);

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
  import ServerMadeMainToast from "$lib/component/toasts/ServerMadeMainToast.svelte";

  function acceptServer() {
    $loading = true;

    showNetworkErrorOnCatch((resolve, reject) => {
      ApiUtil.post({
        path: `/api/panel/servers/${$server.id}/main`,
      })
        .then(async (body) => {
          if (body.result === "ok") {
            callback($server);
            await invalidateAll();
            hide();
            showToast(ServerMadeMainToast, {name: $server.name});
          } else if (body.result === "error") {
            location.reload();
          } else reject();
        })
        .catch(() => {
          reject();
        });
    });
  }
</script>
