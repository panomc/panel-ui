{#if status === TicketStatuses.NEW}
  <span class="badge badge-secondary badge-pill">Yeni</span>
{:else if status === TicketStatuses.REPLIED}
  <span class="badge badge-sunflower badge-pill">Yanıtlandı</span>
{:else if status === TicketStatuses.CLOSED}
  <span class="badge badge-bittersweet badge-pill">Kapalı</span>
{/if}

<script context="module">
  export const TicketStatuses = Object.freeze({
    NEW: 1,
    REPLIED: 2,
    CLOSED: 3,
  });
</script>

<script>
  export let status = TicketStatuses.NEW;
</script>
