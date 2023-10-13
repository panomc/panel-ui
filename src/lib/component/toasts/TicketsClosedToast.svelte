<Toast id="{id}">
  {#if count > 1}
    {@html $_('components.toasts.ticket-closed.multi', {values: {count: `<a href="${base}/tickets/closed">${count}</a>`}})}
  {:else}
    {$_('components.toasts.ticket-closed.single')}
  {/if}
</Toast>

<script>
  import { _ } from "svelte-i18n";

  import { base } from "$app/paths";

  import Toast from "$lib/component/Toast.svelte";

  export let id;
  export let count;
</script>
