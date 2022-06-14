<tr class:table-primary="{ticket.selected}">
  <th scope="row">
    <div class="form-check">
      <input
        class="form-check-input"
        id="postCheck{ticket.id}"
        type="checkbox"
        bind:checked="{$checkedList[ticket.id]}"
      />
    </div>
    <!-- <div class="dropdown">
        <a
          class="btn btn-sm"
          aria-expanded="false"
          data-bs-toggle="dropdown"
          href="javascript:void(0);">
          <i class="fas fa-ellipsis-v"></i>
        </a>
        <div class="dropdown-menu dropdown-menu-start">
          {#if ticket.status !== 3}
            <a
              class="dropdown-item"
              href="javascript:void(0);"
              on:click="{onShowCloseTicketModalClick}">
              <i class="fas fa-times text-bittersweet"></i>
              Kapat
            </a>
          {/if}

          <a
            class="dropdown-item"
            href="javascript:void(0);"
            on:click="{onShowDeleteTicketModalClick}">
            <i class="fas fa-trash text-danger"></i>
            Sil
          </a>
        </div>
      </div> -->
  </th>
  <td class="align-middle text-nowrap">
    <a href="{base}/tickets/ticket/{ticket.id}" title="Görüntüle">
      #{ticket.id}
      {ticket.title}
    </a>
  </td>
  <td class="align-middle text-nowrap">
    <TicketStatus status="{ticket.status}" />
  </td>
  <td class="align-middle text-nowrap">
    <a href="{base}/tickets/category/{ticket.category.url}">
      {ticket.category.title}
    </a>
  </td>
  <td class="align-middle">
    <a
      href="{base}/players/player/{ticket.writer.username}"
      use:tooltip="{[ticket.writer.username, { placement: 'bottom' }]}"
    >
      <img
        src="https://minotar.net/avatar/{ticket.writer.username}/32"
        alt="Oyuncu Adı"
        class="rounded-circle border animate__animated animate__zoomIn"
        height="32"
        width="32"
      />
    </a>
  </td>
  <td class="align-middle text-nowrap">
    <Date time="{ticket.lastUpdate}" />
  </td>
</tr>

<script>
  import { createEventDispatcher } from "svelte";

  import { base } from "$app/paths";

  import Date from "$lib/component/Date.svelte";
  import TicketStatus from "$lib/component/TicketStatus.svelte";

  import tooltip from "$lib/tooltip.util";

  export let ticket;
  export let checkedList;

  const dispatch = createEventDispatcher();

  function onShowCloseTicketModalClick() {
    dispatch("showCloseTicketModalClick", { id: ticket.id });
  }

  function onShowDeleteTicketModalClick() {
    dispatch("showDeleteTicketModalClick", { id: ticket.id });
  }
</script>
