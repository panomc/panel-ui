<Toast id="{id}">{$_('components.toasts.player-authorized-success')}</Toast>

<script>
  import { _ } from "svelte-i18n";

  import Toast from "$lib/component/Toast.svelte";

  export let id;
</script>
