<Tickets data="{data}" />

<script context="module">
  import { load as loadTickets } from "$lib/pages/tickets/CategoryTickets.svelte";

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
  import Tickets from "$lib/pages/tickets/CategoryTickets.svelte";

  export let data;
</script>
