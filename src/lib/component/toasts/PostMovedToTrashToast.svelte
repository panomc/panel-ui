<Toast id="{id}">
  "<a href="{base}/posts/trash" target="_blank">{limitTitle(title)}</a>"
  çöpe taşındı.
</Toast>

<script>
  import { base } from "$app/paths";

  import Toast from "$lib/component/Toast.svelte";
  import { limitTitle } from "$lib/component/ToastContainer.svelte";

  export let id;
  export let title;
</script>
