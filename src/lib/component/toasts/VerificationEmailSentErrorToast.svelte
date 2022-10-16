<Toast id="{id}">
  "{username}" kullanıcısına doğrulama e-mail gönderilemedi. Hata: {errorCode}
</Toast>

<script>
  import Toast from "$lib/component/Toast.svelte";

  export let id;
  export let username;
  export let errorCode;
</script>
