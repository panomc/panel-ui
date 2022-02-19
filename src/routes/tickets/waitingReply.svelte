<Tickets data="{data}" />

<script context="module">
  import { load as loadTickets, PageTypes } from "$lib/component/pages/Tickets.svelte";

  /**
   * @type {import('@sveltejs/kit').Load}
   */
  export async function load(params) {
    let output = {};

    const data = await loadTickets(params, PageTypes.WAITING_REPLY);

    output = {
      ...output,
      ...data,
    };

    return !!data ? output : null;
  }
</script>

<script>
  import Tickets from "$lib/component/pages/Tickets.svelte";

  export let data;
</script>
