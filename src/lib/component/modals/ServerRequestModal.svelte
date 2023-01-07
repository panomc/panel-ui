<!-- Unban Player Modal -->
<div
  aria-hidden="true"
  class="modal fade"
  id="{dialogID}"
  role="dialog"
  tabindex="-1">
  <div class="modal-dialog modal-dialog-centered" role="dialog">
    <div class="modal-content">
      {#if $loading}
        <div class="modal-body">
          <div class="text-center">
            <div class="spinner-border text-primary" role="status"></div>
          </div>
        </div>
      {:else}
        <div class="modal-body text-center">
          <div class="pb-3">
            <i class="fas fa-plug fa-3x d-block m-auto text-gray"></i>
          </div>
          "{$server.name}" sunucusunu platforma bağlamak istediğinizden emin
          misiniz?
          <div class="card bg-light mt-3 text-start">
            <div class="row g-0">
              <div
                class="col-md-4 d-flex align-items-center justify-content-center">
                <img
                  src="{$server.favicon
                    ? $server.favicon
                    : 'https://icons.iconarchive.com/icons/chrisl21/minecraft/64/Crafting-Table-icon.png'}"
                  class="img-fluid"
                  alt="SUNUCU ADI" />
              </div>
              <div class="col-md-8">
                <div class="card-body">
                  <h6 class="card-title">{$server.host}:{$server.port}</h6>
                  <p class="card-text text-muted">
                    {$server.playerCount}/{$server.maxPlayerCount}
                  </p>
                  <small class="badge bg-white text-black rounded-pill"
                    >{$server.type}</small>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="modal-footer flex-nowrap">
          <button
            class="btn btn-link link-danger col-6 m-0"
            type="button"
            class:disabled="{$submitLoading}"
            on:click="{rejectServer}">
            Reddet
          </button>
          <button
            class="btn btn-secondary col-6 m-0"
            type="button"
            class:disabled="{$submitLoading}"
            on:click="{acceptServer}">
            Bağla
          </button>
        </div>
      {/if}
    </div>
  </div>
</div>

<script context="module">
  import { showNetworkErrorOnCatch } from "$lib/Store.js";
  import ApiUtil from "$lib/api.util.js";
  import { writable } from "svelte/store";

  import ExpiredServerConnectRequestToast from "$lib/component/toasts/ExpiredServerConnectRequestToast.svelte";
  import { show as showToast } from "$lib/component/ToastContainer.svelte";

  const dialogID = "serverRequestModal";

  let callback = () => {};
  let hideCallback = () => {};
  let modal;
  const defaultServer = {
    id: -1,
    name: "",
    playerCount: 0,
    maxPlayerCount: 0,
    type: "",
    version: "",
    favicon: "",
    permissionGranted: false,
    status: "OFFLINE",
  };
  const server = writable(defaultServer);
  const loading = writable(true);
  const submitLoading = writable(false);

  export function show(serverId) {
    modal = new window.bootstrap.Modal(document.getElementById(dialogID), {
      backdrop: "static",
      keyboard: false,
    });

    loading.set(true);
    submitLoading.set(false);
    server.set(defaultServer);

    modal.show();

    initData(serverId);
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

  function initData(serverId) {
    showNetworkErrorOnCatch((resolve, reject) => {
      ApiUtil.get({
        path: `/api/panel/servers/${serverId}`,
      })
        .then((body) => {
          if (body.result === "ok") {
            if (body.server.permissionGranted) {
              setTimeout(() => {
                hide();
              }, 500);
              showToast(ExpiredServerConnectRequestToast);

              return;
            }

            server.set(body.server);
            loading.set(false);
          } else if (body.result === "error") {
            setTimeout(() => {
              hide();
            }, 500);
            showToast(ExpiredServerConnectRequestToast);
          } else reject();
        })
        .catch(() => {
          reject();
        });
    });
  }
</script>

<script>
  import AcceptedServerConnectRequestToast from "$lib/component/toasts/AcceptedServerConnectRequestToast.svelte";
  import RejectedServerConnectRequestToast from "$lib/component/toasts/RejectedServerConnectRequestToast.svelte";

  import { getBasicData } from "$lib/layouts/MainLayout.svelte";

  function acceptServer() {
    $submitLoading = true;

    showNetworkErrorOnCatch((resolve, reject) => {
      ApiUtil.post({
        path: `/api/panel/servers/${$server.id}/accept`,
      })
        .then((body) => {
          $submitLoading = false;

          if (body.result === "ok") {
            callback($server);
            getBasicData();
            hide();
            showToast(AcceptedServerConnectRequestToast);
          } else if (body.result === "error") {
            hide();
            showToast(ExpiredServerConnectRequestToast);
          } else reject();
        })
        .catch(() => {
          reject();
        });
    });
  }

  function rejectServer() {
    $submitLoading = true;

    showNetworkErrorOnCatch((resolve, reject) => {
      ApiUtil.post({
        path: `/api/panel/servers/${$server.id}/reject`,
      })
        .then((body) => {
          $submitLoading = false;

          if (body.result === "ok") {
            callback($server);
            hide();
            showToast(RejectedServerConnectRequestToast);
          } else if (body.result === "error") {
            hide();
            showToast(ExpiredServerConnectRequestToast);
          } else reject();
        })
        .catch(() => {
          reject();
        });
    });
  }
</script>
