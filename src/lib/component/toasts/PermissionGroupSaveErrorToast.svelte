<Toast id="{id}">
  {$_('components.toasts.permission-group-save-error', {values: {errorCode}})}
</Toast>

<script>
  import { _ } from "svelte-i18n";

  import Toast from "$lib/component/Toast.svelte";

  export let id;
  export let errorCode;
</script>
