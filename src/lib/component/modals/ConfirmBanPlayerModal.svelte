<!-- Confirm Ban Player Modal -->
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
        Bu oyuncuyu yasaklamak istediğinizden emin misiniz?
        <br />
        <br />
        <div class="form-check form-switch">
          <input
            class="form-check-input"
            type="checkbox"
            role="switch"
            aria-checked="false"
            id="sendNotificationEmailForBan"
            bind:checked="{sendNotification}" />
          <label class="form-check-label" for="sendNotificationEmailForBan"
            >E-posta bildirimi gönder</label>
        </div>
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
          on:click="{onSubmit}">
          Evet
        </button>
      </div>
    </div>
  </div>
</div>

<script context="module">
  import { get, writable } from "svelte/store";

  const dialogID = "banPlayerModal";
  const player = writable({});

  let callback = () => {};
  let hideCallback = () => {};
  let modal;

  export function show(newPlayer) {
    player.set(newPlayer);

    modal = new window.bootstrap.Modal(document.getElementById(dialogID), {
      backdrop: "static",
      keyboard: false,
    });

    modal.show();
  }

  export function hide() {
    hideCallback(get(player));

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
  import { showNetworkErrorOnCatch } from "$lib/Store.js";
  import ApiUtil from "$lib/api.util.js";
  import { show as showToast } from "$lib/component/ToastContainer.svelte";

  import PlayerBanToast from "$lib/component/toasts/PlayerBanToast.svelte";

  let loading;
  let sendNotification = false;

  function onSubmit() {
    loading = true;

    showNetworkErrorOnCatch((resolve, reject) => {
      ApiUtil.post({
        path: `/api/panel/players/${$player.username}/ban`,
        body: {
          sendNotification,
        },
      })
        .then((body) => {
          hide();

          showToast(PlayerBanToast, {
            username: $player.username,
            error: body.error,
          });

          if (body.result === "ok") {
            callback($player);
          }

          loading = false;
        })
        .catch(() => {
          loading = false;
          reject();
        });
    });
  }
</script>
