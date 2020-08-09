<script context="module">
  import jquery from "jquery";
  import { writable, get } from "svelte/store";

  const dialogID = "confirmDeleteTicketCategory";
  const category = writable({
    tickets: [],
  });

  let callback = (category) => {};

  export function show(newCategory) {
    category.set(newCategory);

    jquery("#" + dialogID).modal("show");
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
  import {
    faQuestionCircle,
    faExclamationCircle,
  } from "@fortawesome/free-solid-svg-icons";

  import { showNetworkErrorOnCatch } from "../../Store";
  import ApiUtil from "../../pano/js/api.util";

  let loading = false;

  function refreshBrowserPage() {
    location.reload();
  }

  function onYesClick() {
    showNetworkErrorOnCatch((resolve, reject) => {
      ApiUtil.post("panel/ticket/category/delete", {
        id: get(category).id,
      })
        .then((response) => {
          if (response.data.result === "ok") {
            loading = false;

            hide();

            //TODO TOAST

            callback(get(category));

            resolve();
          } else refreshBrowserPage();
        })
        .catch(() => {
          reject();
        });
    });
  }
</script>

<!-- Confirm Delete Ticket Category Modal -->
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
        {#if $category.ticket_count !== 0}
          Not: Eğer bu kategoriyi silerseniz, şu talepler kategorisiz olarak
          kalacaklardır:
          <br />
          <br />

          {#each $category.tickets as ticket, index (ticket)}
            <a href="/panel/tickets/ticket/{ticket.id}" target="_blank">
              {ticket.title}
            </a>
            <br />
          {/each}

          {#if $category.ticket_count > 5}
            +{$category.ticket_count - 5} talep daha
          {/if}

          <br />
        {/if}
        Bu kategoriyi kalıcı olarak silmek istediğinizden emin misiniz?
      </div>
      <div class="modal-footer">
        <button
          class="btn btn-link text-muted"
          data-dismiss="modal"
          type="button"
          class:disabled="{loading}"
          disabled="{loading}"
        >
          İptal
        </button>
        <button
          class="btn btn-danger"
          type="button"
          class:disabled="{loading}"
          disabled="{loading}"
          on:click="{onYesClick}"
        >
          Evet
        </button>
      </div>
    </div>
  </div>
</div>
