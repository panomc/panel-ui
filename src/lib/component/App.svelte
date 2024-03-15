<style lang="scss" global>
  @import "src/styles/style";
</style>

<slot />

<script>
  import { browser } from "$app/environment";

  if (browser) {
    import("$lib/init.libs.js");

    window.onload = () => {
      const popoverTriggerList = document.querySelectorAll('[data-bs-toggle="popover"]')
      popoverTriggerList.forEach(popoverTriggerEl => new window.bootstrap.Popover(popoverTriggerEl))
    }
  }
</script>
