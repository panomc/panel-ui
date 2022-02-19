<TicketCategories data="{data}" />

<script context="module">
  import { load as loadTicketCategories } from "$lib/component/pages/TicketCategories.svelte";

  /**
   * @type {import('@sveltejs/kit').Load}
   */
  export async function load(params) {
    let output = {};

    const data = await loadTicketCategories(params);

    output = {
      ...output,
      ...data,
    };

    return !!data ? output : null;
  }
</script>

<script>
  import TicketCategories from "$lib/component/pages/TicketCategories.svelte";

  export let data;
</script>
