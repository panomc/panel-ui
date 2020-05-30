<script>
  import Icon from "svelte-awesome";
  import { faQuestionCircle } from "@fortawesome/free-solid-svg-icons";
  import { createEventDispatcher } from "svelte";
  import jQuery from "jquery";

  const dispatch = createEventDispatcher();
  const modalID = "confirmCloseTicket";

  function onConfirmButtonClick() {
    dispatch("confirmButtonClick");
  }

  export const close = () => {
    jQuery("#" + modalID).modal("hide");
  };

  export let selectedTickets;
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
        Bu {selectedTickets.length === 1 ? 'talebi' : 'talepleri'} kapatmak
        istediğinizden emin misiniz?
      </div>
      <div class="modal-footer">
        <button
          class="btn btn-link text-muted"
          data-dismiss="modal"
          type="button"
        >
          İptal
        </button>
        <button
          class="btn btn-danger"
          type="button"
          on:click="{onConfirmButtonClick}"
        >
          Evet
        </button>
      </div>
    </div>
  </div>
</div>
