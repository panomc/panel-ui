<Dashboard data="{data}" />

<script context="module">
  import { load as loadDashboard } from "$lib/pages/Dashboard.svelte";

  /**
   * @type {import('@sveltejs/kit').Load}
   */
  export async function load(params) {
    let output = {};

    const data = await loadDashboard(params);

    output = {
      ...output,
      ...data,
    };

    return !!data ? output : null;
  }
</script>

<script>
  import Dashboard from "$lib/pages/Dashboard.svelte";

  export let data;
</script>
