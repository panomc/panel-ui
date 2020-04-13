<script>
  import page from "page";
  import ChunkComponent from "../Chunk.svelte";
  import {path} from "../RouterStore";
  import {get} from "svelte/store";

  import {isPageChanged, isPageLoading} from '../RouterStore';
  import {isPageInitialized} from '../Store';

  import {ChunkGenerator} from "svelte-spa-chunk";

  import Router from "../router";

  const Chunk = ChunkGenerator(ChunkComponent);

  let props = {};

  page.base("/panel");

  function parse(ctx, next) {
    path.set(ctx.pathname);

    isPageInitialized.set(false);

    next();
  }

  page("*", parse);

  (function SetupRouter(routerValue, parent = "") {
    routerValue.forEach(value => {
      age(parent+value.path, () => {
        props = {
          component: Chunk(() => import(`../${value.component}`))
        };
      });
      if (Array.isArray(value.children)) SetupRouter(value.children, parent+value.path);
    });
  })(Router);

  /*page("/", () => {
    props = {
      component: Chunk(() => import("../pages/Dashboard.svelte"))
    };
  });

  page("/players", () => {
    props = {
      component: Chunk(() => import("../pages/Players.svelte"))
    };
  });

  page("/addons", () => {
    props = {
      component: Chunk(() => import("../pages/Addons.svelte"))
    };
  });

  page("/view", () => {
    props = {
      component: Chunk(() => import("../pages/View.svelte"))
    };
  });

  page("/admins", () => {
    props = {
      component: Chunk(() => import("../pages/Admins.svelte"))
    };
  });

  page("/tools", () => {
    props = {
      component: Chunk(() => import("../pages/Tools.svelte"))
    };
  });

  page("/settings*", () => {
    props = {
      component: Chunk(() => import("../pages/Settings.svelte"))
    };
  });

  page("*", () => {
    props = {
      component: Chunk(() => import("../pages/Error404.svelte"))
    };
  });*/

  page.start();

  export let hidden;
</script>

<div hidden={hidden}>
  <svelte:component this={props.component} {...props}/>
</div>
