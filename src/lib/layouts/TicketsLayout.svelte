<slot />

<ConfirmCloseTicketModal />
<ConfirmDeleteTicketModal />

<script context="module">
  import { redirect } from "@sveltejs/kit";
  import { hasPermission, Permissions } from "$lib/auth.util.js";

  /**
   * @type {import('@sveltejs/kit').LayoutLoad}
   */
  export async function load({ parent }) {
    await parent();

    if (!hasPermission(Permissions.MANAGE_TICKETS)) {
      throw redirect(302, "/");
    }
  }
</script>

<script>
  import ConfirmCloseTicketModal from "$lib/component/modals/ConfirmCloseTicketModal.svelte";
  import ConfirmDeleteTicketModal from "$lib/component/modals/ConfirmDeleteTicketModal.svelte";
</script>
