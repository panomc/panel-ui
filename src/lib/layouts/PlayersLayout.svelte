<slot />

<EditPlayerModal />
<AuthorizePlayerModal />
<ConfirmBanPlayerModal />
<UnbanPlayerModal />

<script context="module">
  import { redirect } from "@sveltejs/kit";

  import { hasPermission, Permissions } from "$lib/auth.util.js";

  /** @type {import('./$types').LayoutLoad} */
  export async function load({ parent, url: { pathname } }) {
    await parent();

    if (pathname.startsWith("/players/player/")) {
      return;
    }

    if (!hasPermission(Permissions.MANAGE_PLAYERS)) {
      throw redirect(302, "/");
    }
  }
</script>

<script>
  import EditPlayerModal from "$lib/component/modals/EditPlayerModal.svelte";
  import AuthorizePlayerModal from "$lib/component/modals/AuthorizePlayerModal.svelte";
  import ConfirmBanPlayerModal from "$lib/component/modals/ConfirmBanPlayerModal.svelte";
  import UnbanPlayerModal from "$lib/component/modals/UnbanPlayerModal.svelte";
</script>
