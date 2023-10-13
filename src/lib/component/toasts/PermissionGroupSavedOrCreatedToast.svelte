<Toast id="{id}">
  {$_('components.toasts.permission-group-saved-or-created.permission-group', {values: {"event": mode === Modes.EDIT ? $_('components.toasts.permission-group-saved-or-created.updated'): $_('components.toasts.permission-group-saved-or-created.saved')}})}
</Toast>

<script>
  import { _ } from "svelte-i18n";

  import Toast from "$lib/component/Toast.svelte";
  import { Modes } from "$lib/pages/players/PermissionGroupDetail.svelte";

  export let id;
  export let mode;
</script>
