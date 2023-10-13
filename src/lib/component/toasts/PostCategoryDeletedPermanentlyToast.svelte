<Toast id="{id}">
  {$_('components.toasts.post-category-deleted-permanently', {values: {title: limitTitle(title)}})}
</Toast>

<script>
  import { _ } from "svelte-i18n";

  import Toast from "$lib/component/Toast.svelte";
  import { limitTitle } from "$lib/component/ToastContainer.svelte";

  export let id;
  export let title;
</script>
