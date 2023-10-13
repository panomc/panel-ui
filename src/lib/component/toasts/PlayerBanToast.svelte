<Toast id="{id}">
  {$_('components.toasts.player-ban.the-player', {values: {
    username,
    event: error ? $_('components.toasts.player-ban.could-not-ban', {values: error}): $_('components.toasts.player-ban.banned')
    }})}
</Toast>

<script>
  import { _ } from "svelte-i18n";

  import Toast from "$lib/component/Toast.svelte";

  export let id;
  export let username;
  export let error;
</script>
