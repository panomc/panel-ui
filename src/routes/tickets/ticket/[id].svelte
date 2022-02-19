<TicketDetail data="{data}" />

<script context="module">
  import { load as loadTicketDetail } from "$lib/pages/tickets/TicketDetail.svelte";

  /**
   * @type {import('@sveltejs/kit').Load}
   */
  export async function load(params) {
    let output = {};

    const data = await loadTicketDetail(params);

    output = {
      ...output,
      ...data,
    };

    return !!data ? output : null;
  }
</script>

<script>
  import TicketDetail from "$lib/pages/tickets/TicketDetail.svelte";

  export let data;
</script>
