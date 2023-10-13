<Toast id="{id}">
  {#if count > 1}
    {$_('components.toasts.tickets-deleted-permanently.multi', {values: {count}})}
  {:else}
    {$_('components.toasts.tickets-deleted-permanently.single')}
  {/if}
</Toast>

<script>
  import { _ } from "svelte-i18n";

  import Toast from "$lib/component/Toast.svelte";

  export let id;
  export let count;
</script>
