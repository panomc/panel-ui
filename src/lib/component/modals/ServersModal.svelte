<!-- Servers Modal -->
<div
  class="modal fade"
  aria-hidden="true"
  id="{dialogID}"
  role="dialog"
  data-bs-scroll="true"
  tabindex="-1">
  <div class="modal-dialog modal-xl">
    <div class="modal-content">
      <div class="modal-header">
        <div class="row justify-content-between w-100">
          <div class="col-4">
            <button
              class="btn btn-secondary btn-sm"
              data-bs-target="#connectServer"
              data-bs-toggle="modal"
              on:click="{hide}">
              <i class="fa-solid fa-plus"></i>
              <span class="d-lg-inline d-none ms-2"> Sunucu Bağla</span>
            </button>
          </div>
          <div class="col-4 d-flex justify-content-center align-items-center">
            <h5 class="modal-title pr-2">Sunucular</h5>
          </div>
          <div class="col-4 d-flex align-items-center">
            <button
              aria-label="Kapat"
              class="btn-close"
              on:click="{hide}"
              title="Pencereyi Kapat"
              type="button">
            </button>
          </div>
        </div>
      </div>

      <div class="modal-body">
        {#if $loading}
          <div class="col-xl-3 col-6 mb-2">
            <a href="javascript:void(0);" class="card bg-light">
              <div class="card-body text-center h-100">
                <img
                  src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII="
                  class="rounded d-block m-auto mb-3"
                  height="64"
                  width="64"
                  alt="" />
                <p class="badge bg-light text-light mb-3">.</p>
                <h6 class="card-title placeholder-glow">
                  <span class="placeholder col-7"></span>
                </h6>
                <p class="card-text placeholder-glow">
                  <span class="placeholder col-3"></span>
                </p>
              </div>
            </a>
          </div>
        {/if}

        <div class="row">
          {#each $servers as server, index (server)}
            <!-- Server Card -->

            <div class="col-xl-3 col-6 mb-2">
              <a
                href="javascript:void(0);"
                on:click="{() => onSelect(server)}"
                class="card bg-light animate__animated animate__fadeIn"
                class:border="{$selectedServer &&
                  $selectedServer.id === server.id}"
                class:border-3="{$selectedServer &&
                  $selectedServer.id === server.id}"
                class:border-primary="{$selectedServer &&
                  $selectedServer.id === server.id}">
                <div class="card-body text-center position-relative h-100">
                  {#if server.id === $mainServer.id}
                    <div
                      class="position-absolute top-0 start-50 translate-middle rounded bg-primary p-1 text-white"
                      use:tooltip="{['Ana Sunucu', { placement: 'bottom' }]}">
                      <i class="fa-solid fa-house"></i>
                    </div>
                  {/if}
                  <img
                    src="{server.favicon
                      ? server.favicon
                      : 'https://icons.iconarchive.com/icons/chrisl21/minecraft/64/Crafting-Table-icon.png'}"
                    class="rounded d-block m-auto mb-3 bg-white"
                    height="64"
                    width="64"
                    alt="" />

                  {#if server.status === "ONLINE"}
                    <p
                      class="badge bg-secondary text-white rounded-pill mb-3"
                      use:tooltip="{['Çevrimiçi', { placement: 'bottom' }]}">
                      {server.type}
                    </p>
                  {:else}
                    <p class="badge bg-white text-black rounded-pill mb-3">
                      {server.type}
                    </p>
                  {/if}
                  <h6 class="card-title">{server.host}:{server.port}</h6>
                  <p class="card-text text-muted">
                    {server.playerCount}/{server.maxPlayerCount}
                  </p>
                </div>
              </a>
            </div>
          {/each}
        </div>
      </div>

      <!-- No Server -->
      {#if $servers.length === 0 && !$loading}
        <NoContent icon="fas fa-cube fa-3x" text="Bağlı sunucu yok."/>
      {/if}
    </div>
  </div>
</div>

<script context="module">
  import { writable } from "svelte/store";

  import { showNetworkErrorOnCatch } from "$lib/Store.js";
  import ApiUtil from "$lib/api.util.js";
  import tooltip from "$lib/tooltip.util";

  const dialogID = "serversModal";

  let callback = () => {};
  let hideCallback = () => {};
  let modal;

  const servers = writable([]);
  const loading = writable(true);

  export function show() {
    modal = new window.bootstrap.Modal(document.getElementById(dialogID));

    loading.set(true);

    modal.show();

    initData();
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

  function initData() {
    showNetworkErrorOnCatch((resolve, reject) => {
      ApiUtil.get({
        path: `/api/panel/servers`,
      })
        .then((body) => {
          if (body.result === "ok") {
            servers.set(body.servers);
            loading.set(false);
          } else reject();
        })
        .catch(() => {
          reject();
        });
    });
  }
</script>

<script>
  import { mainServer, selectedServer } from "$lib/Store.js";
  import { show as showToast } from "$lib/component/ToastContainer.svelte";
  import ServerNotExistsToast from "$lib/component/toasts/ServerNotExistsToast.svelte";
  import NoContent from "$lib/component/NoContent.svelte";

  function onSelect(server) {
    loading.set(true);

    showNetworkErrorOnCatch((resolve, reject) => {
      ApiUtil.post({
        path: `/api/panel/servers/${server.id}/select`,
      })
        .then((body) => {
          if (body.result === "ok") {
            loading.set(false);
            $selectedServer = server;
            hide();
          } else if (body.error && body.error === "NOT_EXISTS") {
            showToast(ServerNotExistsToast);
            initData();
          } else reject();
        })
        .catch((err) => {
          console.log(err);
          reject();
        });
    });
  }
</script>
