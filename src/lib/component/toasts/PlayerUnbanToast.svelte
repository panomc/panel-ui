<Toast id="{id}">
  {$_('components.toasts.player-unban.the-player', {values: {
      username,
      event: error ? $_('components.toasts.player-unban.could-not-remove-ban', {values: error}): $_('components.toasts.player-unban.removed-ban')
    }})}
</Toast>

<script>
  import { _ } from "svelte-i18n";

  import Toast from "$lib/component/Toast.svelte";

  export let id;
  export let username;
  export let error;
</script>
