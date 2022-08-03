<SiteSettings data="{data}" />

<script context="module">
  import { load as loadSiteSettings } from "$lib/pages/settings/SiteSettings.svelte";

  /**
   * @type {import('@sveltejs/kit').Load}
   */
  export async function load(params) {
    let output = {};

    const data = await loadSiteSettings(params);

    output = {
      ...output,
      ...data,
    };

    return !!data ? output : null;
  }
</script>

<script>
  import SiteSettings from "$lib/pages/settings/SiteSettings.svelte";

  export let data;
</script>
