<!-- Confirm Close Ticket Modal -->
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
        Bu
        {$selectedTickets.length === 1 ? "talebi" : "talepleri"}
        kalıcı olarak silmek istediğinizden emin misiniz?
      </div>
      <div class="modal-footer">
        <button
          class="btn btn-link text-muted"
          type="button"
          class:disabled="{loading}"
          aria-disabled="{loading}"
          disabled="{loading}"
          on:click="{hide}"
        >
          İptal
        </button>
        <button
          class="btn btn-danger"
          type="button"
          class:disabled="{loading}"
          aria-disabled="{loading}"
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
  import jquery from "jquery";
  import { writable, get } from "svelte/store";

  const dialogID = "confirmDeleteTicket";
  const selectedTickets = writable([]);

  let callback = (selectedTickets) => {};
  let hideCallback = (selectedTickets) => {};

  export function show(newSelectedTickets) {
    selectedTickets.set(newSelectedTickets);

    jquery("#" + dialogID).modal({ backdrop: "static", keyboard: false });
  }

  export function setCallback(newCallback) {
    callback = newCallback;
  }

  export function hide() {
    hideCallback(get(selectedTickets));

    jquery("#" + dialogID).modal("hide");
  }

  export function onHide(newCallback) {
    hideCallback = newCallback;
  }
</script>

<script>
  import { showNetworkErrorOnCatch } from "$lib/store";
  import ApiUtil from "$lib/api.util";

  let loading;

  function refreshBrowserPage() {
    location.reload();
  }

  function onYesClick() {
    loading = true;

    showNetworkErrorOnCatch((resolve, reject) => {
      ApiUtil.post("panel/ticket/delete/selectedTickets", {
        tickets: Object.values(get(selectedTickets)),
      })
        .then((response) => {
          if (response.data.result === "ok") {
            loading = false;

            hide();

            //TODO TOAST

            callback(get(selectedTickets));

            resolve();
          } else refreshBrowserPage();
        })
        .catch(() => {
          reject();
        });
    });
  }
</script>
