<Toast id="{id}">
  "{username}" kullanıcısının {#if error}
    yasağı kaldırılamadı, hata: {error}{:else}yasağı kaldırıldı.{/if}
</Toast>

<script>
  import Toast from "$lib/component/Toast.svelte";

  export let id;
  export let username;
  export let error;
</script>
