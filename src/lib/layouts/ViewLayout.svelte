<!-- View Page -->

<!-- View Page Contents -->
<article class="container">
  <!-- View Categories Navigation -->
  <nav>
    <CardMenu>
      <CardMenuItem href="/view">
        Temalar
      </CardMenuItem>
      <CardMenuItem href="/view/theme-options">
        Tema Seçenekleri
      </CardMenuItem>
    </CardMenu>
  </nav>

  <slot />
</article>

<script context="module">
  import { redirect } from "@sveltejs/kit";
  import { hasPermission, Permissions } from "$lib/auth.util.js";

  /**
   * @type {import('@sveltejs/kit').LayoutLoad}
   */
  export async function load({ parent }) {
    const parentData = await parent();
    const { user } = parentData;

    if (!hasPermission(Permissions.MANAGE_VIEW, user)) {
      throw redirect(302, "/");
    }

    return parentData;
  }
</script>

<script>
  import { base } from "$app/paths";
  import { page } from "$app/stores";
  import CardMenu from "$lib/component/CardMenu.svelte";
  import CardMenuItem from "$lib/component/CardMenuItem.svelte";

  function matching(path, pathName, startsWith = false) {
    return (
      path.toUpperCase() === pathName.toUpperCase() ||
      path.toUpperCase() === (pathName + "/").toUpperCase() ||
      (startsWith && path.startsWith(pathName))
    );
  }
</script>
