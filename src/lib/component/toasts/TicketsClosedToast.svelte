<Toast id="{id}">
  {#if count > 1}
    <a href="{base}/tickets/closed">{count}</a> talep kapatıldı.
  {:else}
    Talep kapatıldı.
  {/if}
</Toast>

<script>
  import { base } from "$app/paths";

  import Toast from "$lib/component/Toast.svelte";

  export let id;
  export let count;
</script>
