<Toast id="{id}">
  Yetki grubu kaydedilemedi! Hata: {errorCode}
</Toast>

<script>
  import Toast from "$lib/component/Toast.svelte";

  export let id;
  export let errorCode;
</script>
