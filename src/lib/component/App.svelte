<style lang="scss" global>
  @import "src/styles/style";
</style>

<slot />

<script>
  import { browser } from "$app/env";

  if (browser) {
    import("$lib/init.libs.js");
  }
</script>
