<Toast id="{id}">
  "<a href="{base}/posts/post/{postId}" target="_blank">{limitTitle(title)}</a>"
  kaydedildi.
</Toast>

<script>
  import { base } from "$app/paths";

  import Toast from "$lib/component/Toast.svelte";
  import { limitTitle } from "$lib/component/ToastContainer.svelte";

  export let id;
  export let postId;
  export let title;
</script>
