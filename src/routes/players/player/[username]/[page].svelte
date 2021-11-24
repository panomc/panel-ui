<Player data="{data}" />

<script context="module">
  import { load as loadPlayer } from "../../../_Player.svelte";

  /**
   * @type {import('@sveltejs/kit').Load}
   */
  export async function load(params) {
    let output = {};

    const data = await loadPlayer(params);

    output = {
      ...output,
      ...data,
    };

    return !!data ? output : null;
  }
</script>

<script>
  import Player from "../../../_Player.svelte";

  export let data;
</script>
