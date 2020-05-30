<script>
  import Icon from "svelte-awesome";
  import { faQuestionCircle } from "@fortawesome/free-solid-svg-icons";
  import { createEventDispatcher } from "svelte";
  import jQuery from "jquery";

  const dispatch = createEventDispatcher();
  export const modalID = "confirmDeleteTicket";

  export let loading;
  export let selectedTickets;

  function onConfirmButtonClick() {
    dispatch("confirmButtonClick");
  }

  export const close = () => {
    jQuery("#" + modalID).modal("hide");
  };
</script>

<!-- Confirm Close Ticket Modal -->
<div
  aria-hidden="true"
  class="modal fade"
  id="{modalID}"
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
        Bu {selectedTickets.length === 1 ? 'talebi' : 'talepleri'} kalıcı olarak
        silmek istediğinizden emin misiniz?
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
          class="btn btn-danger"
          type="button"
          class:disabled="{loading}"
          aria-disabled="{loading}"
          disabled="{loading}"
        >
          Evet
        </button>
      </div>
    </div>
  </div>
</div>
