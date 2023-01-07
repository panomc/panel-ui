<slot/>

<script context="module">
  import { redirect } from "@sveltejs/kit";
  import { hasPermission, Permissions } from "$lib/auth.util.js";

  /**
   * @type {import('@sveltejs/kit').LayoutLoad}
   */
  export async function load({ parent }) {
    await parent();

    if (!hasPermission(Permissions.MANAGE_PERMISSION_GROUPS)) {
      throw redirect(302, "/");
    }
  }
</script>