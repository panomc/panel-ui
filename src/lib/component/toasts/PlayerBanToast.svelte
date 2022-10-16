<Toast id="{id}">
  "{username}" kullanıcısı {#if error}
    yasaklanamadı, hata: {error}{:else}yasaklandı.{/if}
</Toast>

<script>
  import Toast from "$lib/component/Toast.svelte";

  export let id;
  export let username;
  export let error;
</script>
