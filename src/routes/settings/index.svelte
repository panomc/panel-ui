<GeneralSettings data="{data}" />

<script context="module">
  import { load as loadGeneralSettings } from "$lib/pages/settings/GeneralSettings.svelte";

  /**
   * @type {import('@sveltejs/kit').Load}
   */
  export async function load(params) {
    let output = {};

    const data = await loadGeneralSettings(params);

    output = {
      ...output,
      ...data,
    };

    return !!data ? output : null;
  }
</script>

<script>
  import GeneralSettings from "$lib/pages/settings/GeneralSettings.svelte";

  export let data;
</script>