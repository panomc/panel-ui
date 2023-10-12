{#if status === TicketStatuses.NEW}
  <a href="{base}/tickets/waitingReply"
    ><span class="badge bg-success text-white rounded-pill" title="{$_('components.ticket-status-badge.filter')}"
      >{$_('components.ticket-status-badge.new')}</span
    ></a>
{:else if status === TicketStatuses.REPLIED}
  <a href="{base}/tickets"
    ><span class="badge bg-warning text-white rounded-pill" title="{$_('components.ticket-status-badge.filter')}"
      >{$_('components.ticket-status-badge.replied')}</span
    ></a>
{:else if status === TicketStatuses.CLOSED}
  <a href="{base}/tickets/closed"
    ><span class="badge bg-danger text-white rounded-pill" title="{$_('components.ticket-status-badge.filter')}"
      >{$_('components.ticket-status-badge.closed')}</span
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
  import { _ } from "svelte-i18n";

  import { base } from "$app/paths";

  export let status = TicketStatuses.NEW;
</script>
