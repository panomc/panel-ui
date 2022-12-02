<Toast id="{id}">
  Yetki grubu {#if mode === Modes.EDIT} güncellendi. {:else} kaydedildi. {/if}
</Toast>

<script>
  import Toast from "$lib/component/Toast.svelte";
  import { Modes } from "$lib/pages/players/PermissionGroupDetail.svelte";

  export let id;
  export let mode;
</script>
