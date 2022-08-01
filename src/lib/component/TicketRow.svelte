<tr class:table-primary="{ticket.selected}">
  <th scope="row" class="align-middle">
    <div class="form-check">
      <input
        class="form-check-input"
        id="postCheck{ticket.id}"
        type="checkbox"
        bind:checked="{$checkedList[ticket.id]}" />
    </div>
  </th>
  <td class="align-middle text-nowrap">
    <a href="{base}/tickets/ticket/{ticket.id}" title="Görüntüle">
      #{ticket.id}
      {ticket.title}
    </a>
  </td>
  <td class="align-middle">
    <a href="{base}/players/player/{ticket.writer.username}">
      <img
        src="https://crafthead.net/avatar/{ticket.writer.username}/32"
        alt="Oyuncu Adı"
        class="rounded-circle animate__animated animate__zoomIn me-2"
        height="32"
        width="32" />
      {ticket.writer.username}
    </a>
  </td>
  <td class="align-middle text-nowrap">
    <a
      class="badge bg-light link-dark rounded-pill"
      use:tooltip="{['Filtrele', { placement: 'bottom' }]}"
      href="{base}/tickets/category/{ticket.category.url}">
      {ticket.category.title === "-" ? "Kategorisiz" : ticket.category.title}
    </a>
  </td>
  <td class="align-middle text-nowrap">
    <TicketStatus status="{ticket.status}" />
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
