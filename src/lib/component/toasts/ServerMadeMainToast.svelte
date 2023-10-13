<Toast id="{id}">{$_('components.toasts.server-made-main', {values: {name}})}</Toast>

<script>
  import { _ } from "svelte-i18n";

  import Toast from "$lib/component/Toast.svelte";

  export let id;
  export let name;
</script>
