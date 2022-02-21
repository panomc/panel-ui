<App>
  <Layout>
    <slot />
  </Layout>
</App>

<script context="module">
  import { load as loadLayout } from "$lib/layouts/MainLayout.svelte";

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
  import Layout from "$lib/layouts/MainLayout.svelte";
  import App from "$lib/component/App.svelte";
</script>
