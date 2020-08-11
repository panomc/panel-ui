<script context="module">
  import jquery from "jquery";
  import { writable, get } from "svelte/store";

  const dialogID = "confirmCloseTicket";
  const selectedTickets = writable([]);

  let callback = (selectedTickets) => {};

  export function show(newSelectedTickets) {
    selectedTickets.set(newSelectedTickets);

    jquery("#" + dialogID).modal({ backdrop: "static", keyboard: false });
  }

  export function setCallback(newCallback) {
    callback = newCallback;
  }

  export function hide() {
    jquery("#" + dialogID).modal("hide");
  }
</script>

<script>
  import Icon from "svelte-awesome";
  import { faQuestionCircle } from "@fortawesome/free-solid-svg-icons";

  import { showNetworkErrorOnCatch } from "../../Store";
  import ApiUtil from "../../pano/js/api.util";

  let loading;

  function refreshBrowserPage() {
    location.reload();
  }

  function onYesClick() {
    loading = true;

    showNetworkErrorOnCatch((resolve, reject) => {
      ApiUtil.post("panel/ticket/close/selectedList", {
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
          <Icon
            data="{faQuestionCircle}"
            scale="3"
            class="d-block m-auto text-gray"
          />
        </div>
        Bu {$selectedTickets.length === 1 ? 'talebi' : 'talepleri'} kapatmak
        istediğinizden emin misiniz?
      </div>
      <div class="modal-footer">
        <button
          class="btn btn-link text-muted"
          data-dismiss="modal"
          type="button"
          class:disabled="{loading}"
          aria-disabled="{loading}"
          disabled="{loading}"
        >
          İptal
        </button>
        <button
          class="btn btn-bittersweet"
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
