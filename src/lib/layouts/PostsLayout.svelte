<slot />

<ConfirmDeletePostModal />

<script context="module">
  import { redirect } from "@sveltejs/kit";
  import { hasPermission, Permissions } from "$lib/auth.util.js";

  /**
   * @type {import('@sveltejs/kit').LayoutLoad}
   */
  export async function load({ parent }) {
    const parentData = await parent();
    const { user } = parentData;

    if (!hasPermission(Permissions.MANAGE_POSTS, user)) {
      throw redirect(302, "/");
    }

    return parentData;
  }
</script>

<script>
  import ConfirmDeletePostModal from "$lib/component/modals/ConfirmDeletePostModal.svelte";
</script>
