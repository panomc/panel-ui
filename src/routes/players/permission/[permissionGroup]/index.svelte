<Players data="{data}" />

<script context="module">
  import { load as loadPlayers } from "../../../_PermissionPlayers.svelte";

  /**
   * @type {import('@sveltejs/kit').Load}
   */
  export async function load(params) {
    let output = {};

    const data = await loadPlayers(params);

    output = {
      ...output,
      ...data,
    };

    return !!data ? output : null;
  }
</script>

<script>
  import Players from "../../../_PermissionPlayers.svelte";

  export let data;
</script>
