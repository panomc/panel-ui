<Tickets data="{data}" />

<script context="module">
  import { load as loadTickets } from "../../../_CategoryTickets.svelte";

  /**
   * @type {import('@sveltejs/kit').Load}
   */
  export async function load(params) {
    let output = {};

    const data = await loadTickets(params);

    output = {
      ...output,
      ...data,
    };

    return !!data ? output : null;
  }
</script>

<script>
  import Tickets from "../../../_CategoryTickets.svelte";

  export let data;
</script>
