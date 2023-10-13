<Toast id="{id}">
  {$_('components.toasts.settings-save-error', {values: {errorCode}})}
</Toast>

<script>
  import { _ } from "svelte-i18n";

  import Toast from "$lib/component/Toast.svelte";

  export let id;
  export let errorCode;
</script>
