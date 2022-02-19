<Permissions data="{data}" />

<script context="module">
  import { load as loadPermissions } from "$lib/component/pages/players/Permissions.svelte";

  /**
   * @type {import('@sveltejs/kit').Load}
   */
  export async function load(params) {
    let output = {};

    const data = await loadPermissions(params);

    output = {
      ...output,
      ...data,
    };

    return !!data ? output : null;
  }
</script>

<script>
  import Permissions from "$lib/component/pages/players/Permissions.svelte";

  export let data;
</script>
