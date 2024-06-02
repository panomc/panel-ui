<a
  class:active="{active}"
  class="btn btn-sm btn-outline-primary text-truncate"
  role="button"
  href="{base + href}">
  <slot />
</a>

<script>
  import { page } from "$app/stores";
  import { base } from "$app/paths";
  import { _ } from "svelte-i18n";

  export let href;
  export let active;
</script>
