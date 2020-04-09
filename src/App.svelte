<script>
  import router from "page";
  import page from "page"
  import {ChunkGenerator} from "svelte-spa-chunk";

  import ChunkComponent from "./Chunk.svelte";
  import {isPageLoading} from "./ChunkStore";

  import PageLoading from "./components/PageLoading.svelte";

  const Chunk = ChunkGenerator(ChunkComponent);

  let props = {};

  page.base("/panel")

  router("/", () => {
    props = {
      component: Chunk(() => import("./pages/Dashboard.svelte"))
    };
  });

  router("*", () => {
    props = {
      component: Chunk(() => import("./pages/Error404.svelte"))
    };
  });

  router.start();
</script>

<style lang="scss" global>
  @import "styles/main";
</style>

{#if $isPageLoading}
  <PageLoading/>
{/if}

<svelte:component this={props.component} {...props}/>
