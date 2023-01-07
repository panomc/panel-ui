<slot />

<ConfirmDeletePostModal />

<script context="module">
  import { redirect } from "@sveltejs/kit";
  import { hasPermission, Permissions } from "$lib/auth.util.js";

  /**
   * @type {import('@sveltejs/kit').LayoutLoad}
   */
  export async function load({ parent }) {
    await parent();

    if (!hasPermission(Permissions.MANAGE_POSTS)) {
      throw redirect(302, "/");
    }
  }
</script>

<script>
  import ConfirmDeletePostModal from "$lib/component/modals/ConfirmDeletePostModal.svelte";
</script>
