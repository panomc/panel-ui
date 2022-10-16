<Toast id="{id}">
  "{username}" kullanıcısına doğrulama e-mail'i gönderildi.
</Toast>

<script>
  import Toast from "$lib/component/Toast.svelte";

  export let id;
  export let username;
</script>
