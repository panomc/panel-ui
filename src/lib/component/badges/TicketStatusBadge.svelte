{#if status === TicketStatuses.NEW}
  <a href="{base}/tickets/waitingReply"
    ><span class="badge bg-success text-white rounded-pill" title="Filtrele"
      >Yeni</span
    ></a>
{:else if status === TicketStatuses.REPLIED}
  <a href="{base}/tickets"
    ><span class="badge bg-warning text-white rounded-pill" title="Filtrele"
      >Yanıtlandı</span
    ></a>
{:else if status === TicketStatuses.CLOSED}
  <a href="{base}/tickets/closed"
    ><span class="badge bg-danger text-white rounded-pill" title="Filtrele"
      >Kapalı</span
    ></a>
{/if}

<script context="module">
  export const TicketStatuses = Object.freeze({
    NEW: 1,
    REPLIED: 2,
    CLOSED: 3,
  });
</script>

<script>
  import { base } from "$app/paths";

  export let status = TicketStatuses.NEW;
</script>
