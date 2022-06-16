{#if status === TicketStatuses.NEW}
  <a href="{base}/tickets/waitingReply"
    ><span
      class="badge bg-mint text-white rounded-pill"
      use:tooltip="{['Filtrele', { placement: 'bottom' }]}">Yeni</span
    ></a>
{:else if status === TicketStatuses.REPLIED}
  <a href="{base}/tickets"
    ><span
      class="badge bg-sunflower text-white rounded-pill"
      use:tooltip="{['Filtrele', { placement: 'bottom' }]}">Yanıtlandı</span
    ></a>
{:else if status === TicketStatuses.CLOSED}
  <a href="{base}/tickets/closed"
    ><span
      class="badge bg-bittersweet text-white rounded-pill"
      use:tooltip="{['Filtrele', { placement: 'bottom' }]}">Kapalı</span
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

  import tooltip from "$lib/tooltip.util";

  export let status = TicketStatuses.NEW;
</script>
