<Toast id="{id}">
  {$_('components.toasts.enabling-addon-failed-by-dependency-error', {values: {addon}})}
</Toast>

<script>
  import { _ } from "svelte-i18n";

  import Toast from "$lib/component/Toast.svelte";

  export let id;
  export let addon;
</script>
