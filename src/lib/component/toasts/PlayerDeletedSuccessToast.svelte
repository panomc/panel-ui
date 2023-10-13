<Toast id="{id}">{$_('player-deleted-success', {values: {username}})}</Toast>

<script>
  import { _ } from "svelte-i18n";

  import Toast from "$lib/component/Toast.svelte";

  export let id;
  export let username;
</script>
