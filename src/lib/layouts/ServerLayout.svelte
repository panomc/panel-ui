<slot />

<script context="module">
  import { redirect } from "@sveltejs/kit";
  import { hasPermission, Permissions } from "$lib/auth.util.js";
  import { get } from "svelte/store";

  /**
   * @type {import('@sveltejs/kit').LayoutLoad}
   */
  export async function load({ parent }) {
    const parentData = await parent();
    const { user, selectedServer } = parentData;

    if (!hasPermission(Permissions.MANAGE_SERVERS, user)) {
      throw redirect(302, "/");
    }

    if (!get(selectedServer)) {
      throw redirect(302, "/");
    }

    return parentData;
  }
</script>
