<Players data="{data}" />

<script context="module">
  import { load as loadPlayers, PageTypes } from "$lib/pages/Players.svelte";

  /**
   * @type {import('@sveltejs/kit').Load}
   */
  export async function load(params) {
    let output = {};

    const data = await loadPlayers(params, PageTypes.BANNED);

    output = {
      ...output,
      ...data,
    };

    return !!data ? output : null;
  }
</script>

<script>
  import Players from "$lib/pages/Players.svelte";

  export let data;
</script>
