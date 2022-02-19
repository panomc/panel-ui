<Layout>
  <slot />
</Layout>

<script context="module">
  import { load as loadLayout } from "$lib/component/layouts/Layout.svelte";

  /**
   * @type {import('@sveltejs/kit').Load}
   */
  export async function load(params) {
    let output = {};

    const data = await loadLayout(params);

    output = {
      ...output,
      ...data,
    };

    return !!data ? output : null;
  }
</script>

<script>
  import Layout from "$lib/component/layouts/Layout.svelte";
</script>
