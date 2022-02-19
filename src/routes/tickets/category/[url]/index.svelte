<Tickets data="{data}" />

<script context="module">
  import { load as loadTickets } from "$lib/component/pages/tickets/CategoryTickets.svelte";

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
  import Tickets from "$lib/component/pages/tickets/CategoryTickets.svelte";

  export let data;
</script>
