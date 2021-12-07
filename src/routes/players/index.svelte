<Players data="{data}" />

<script context="module">
  import { load as loadPlayers } from "../_Players.svelte";

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
  import Players from "../_Players.svelte";

  export let data;
</script>
