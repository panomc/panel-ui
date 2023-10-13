<Toast id="{id}">
  {@html $_('components.toasts.post-moved-to-trash', {values: {title: `<a href="${base}/posts/trash" target="_blank">${limitTitle(title)}</a>`}})}
</Toast>

<script>
  import { _ } from "svelte-i18n";

  import { base } from "$app/paths";

  import Toast from "$lib/component/Toast.svelte";
  import { limitTitle } from "$lib/component/ToastContainer.svelte";

  export let id;
  export let title;
</script>
