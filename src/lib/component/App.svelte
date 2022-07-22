<style lang="scss" global>
  @import "src/styles/style";
</style>

<slot />

<NotificationContainer/>

<script>
  import { browser } from "$app/env";
  import NotificationContainer from "$lib/component/NotificationContainer.svelte"

  if (browser) {
    import("$lib/init.libs.js");
  }
</script>
