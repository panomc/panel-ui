<slot />

<script context="module">
  import { redirect } from "@sveltejs/kit";
  import { hasPermission, Permissions } from "$lib/auth.util.js";
  import { get } from "svelte/store";
  import { selectedServer } from "$lib/Store.js";

  /**
   * @type {import('@sveltejs/kit').LayoutLoad}
   */
  export async function load({ parent }) {
    const parentData = await parent();

    if (!hasPermission(Permissions.MANAGE_SERVERS)) {
      throw redirect(302, "/");
    }

    if (!get(selectedServer)) {
      throw redirect(302, "/");
    }
  }
</script>
