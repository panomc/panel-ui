<Toast id="{id}">
  {$_('components.toasts.verification-email-sent-error', {values: {username, errorCode}})}
</Toast>

<script>
  import { _ } from "svelte-i18n";

  import Toast from "$lib/component/Toast.svelte";

  export let id;
  export let username;
  export let errorCode;
</script>
