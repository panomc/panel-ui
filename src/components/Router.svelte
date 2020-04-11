<script>
  import router from "page";
  import page from "page";
  import ChunkComponent from "../Chunk.svelte";

  import {ChunkGenerator} from "svelte-spa-chunk";

  const Chunk = ChunkGenerator(ChunkComponent);

  let props = {};

  page.base("/panel");

  router("/", () => {
    props = {
      component: Chunk(() => import("../pages/Dashboard.svelte"))
    };
  });

  router("*", () => {
    props = {
      component: Chunk(() => import("../pages/Error404.svelte"))
    };
  });

  router.start();
</script>

<svelte:component this={props.component} {...props}/>