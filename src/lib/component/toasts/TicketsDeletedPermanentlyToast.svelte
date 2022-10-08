<Toast id="{id}">
  {#if count > 1}
    {count} talep kalıcı olarak silindi.
  {:else}
    Talep kalıcı olarak silindi.
  {/if}
</Toast>

<script>
  import Toast from "$lib/component/Toast.svelte";

  export let id;
  export let count;
</script>
