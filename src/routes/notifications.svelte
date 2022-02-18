<Notifications data="{data}" />

<script context="module">
  import { load as loadNotifications } from "$lib/component/pages/Notifications.svelte";

  /**
   * @type {import('@sveltejs/kit').Load}
   */
  export async function load(params) {
    let output = {};

    const data = await loadNotifications(params);

    output = {
      ...output,
      ...data,
    };

    return !!data ? output : null;
  }
</script>

<script>
  import Notifications from "$lib/component/pages/Notifications.svelte";

  export let data;
</script>
