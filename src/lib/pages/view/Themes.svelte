<!-- Theme Settings -->


<ConfirmDeleteThemeModal />

<script>
  import { getContext } from "svelte";

  import { base } from "$app/paths";

  import ConfirmDeleteThemeModal from "$lib/component/modals/ConfirmDeleteThemeModal.svelte";

  const pageTitle = getContext("pageTitle");

  pageTitle.set("Temalar");
</script>
