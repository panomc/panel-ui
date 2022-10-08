<Toast id="{id}">
  "{limitTitle(title)}" kalıcı olarak silindi.
</Toast>

<script>
  import Toast from "$lib/component/Toast.svelte";
  import { limitTitle } from "$lib/component/ToastContainer.svelte";

  export let id;
  export let title;
</script>
