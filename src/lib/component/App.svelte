<style lang="scss" global>
  @import "src/styles/style";
</style>

<slot />

<NotificationContainer/>
<ToastContainer/>

<script>
  import { browser } from "$app/env";
  import NotificationContainer from "$lib/component/NotificationContainer.svelte"
  import ToastContainer from "$lib/component/ToastContainer.svelte";

  if (browser) {
    import("$lib/init.libs.js");
  }
</script>
