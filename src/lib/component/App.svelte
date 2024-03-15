<style lang="scss" global>
  @import "src/styles/style";
</style>

<slot />

<script>
  import { browser } from "$app/environment";
  import { page } from "$app/stores";
  import { onDestroy } from "svelte";

  function loadPopOver() {
    const popoverTriggerList = document.querySelectorAll('[data-bs-toggle="popover"]')
    popoverTriggerList.forEach(popoverTriggerEl => new window.bootstrap.Popover(popoverTriggerEl))
  }

  if (browser) {
    import("$lib/init.libs.js");

    window.onload = () => {
      loadPopOver()
    }
  }
  onDestroy(page.subscribe(() => {
    if (browser) {
      loadPopOver()
    }
  }))

</script>
