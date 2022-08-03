<About data="{data}" />

<script context="module">
  import { load as loadAbout } from "$lib/pages/settings/About.svelte";

  /**
   * @type {import('@sveltejs/kit').Load}
   */
  export async function load(params) {
    let output = {};

    const data = await loadAbout(params);

    output = {
      ...output,
      ...data,
    };

    return !!data ? output : null;
  }
</script>

<script>
  import About from "$lib/pages/settings/About.svelte";

  export let data;
</script>
