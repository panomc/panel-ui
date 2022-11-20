<Toast id="{id}">
  Ayarlar kaydedilemedi! Hata: {errorCode}
</Toast>

<script>
  import Toast from "$lib/component/Toast.svelte";

  export let id;
  export let errorCode;
</script>
