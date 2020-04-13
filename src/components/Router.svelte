<script>
  import router from "page";
  import page from "page";
  import ChunkComponent from "../Chunk.svelte";
  import {path} from "../RouterStore";
  import {get} from "svelte/store";

  import {isPageChanged, isPageLoading} from '../RouterStore';
  import {isPageInitialized} from '../Store';

  import {ChunkGenerator} from "svelte-spa-chunk";

  const Chunk = ChunkGenerator(ChunkComponent);

  let props = {};

  page.base("/panel");

  function parse(ctx, next) {
    path.set(ctx.pathname);

    console.log("geldi amk ---> " + ctx.pathname)

    isPageInitialized.set(false);

    next();
  }

  router("*", parse);

  router("/", () => {
    props = {
      component: Chunk(() => import("../pages/Dashboard.svelte"))
    };
  });

  router("/players", () => {
    props = {
      component: Chunk(() => import("../pages/Players.svelte"))
    };
  });

  router("/addons", () => {
    props = {
      component: Chunk(() => import("../pages/Addons.svelte"))
    };
  });

  router("/view", () => {
    props = {
      component: Chunk(() => import("../pages/View.svelte"))
    };
  });

  router("/admins", () => {
    props = {
      component: Chunk(() => import("../pages/Admins.svelte"))
    };
  });

  router("/tools", () => {
    props = {
      component: Chunk(() => import("../pages/Tools.svelte"))
    };
  });

  router("*", () => {
    props = {
      component: Chunk(() => import("../pages/Error404.svelte"))
    };
  });

  router.start();

  export let hidden;
</script>

<div hidden={hidden}>
  <svelte:component this={props.component} {...props}/>
</div>