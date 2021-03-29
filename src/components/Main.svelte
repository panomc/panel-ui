<div class:d-flex="{!hidden}" hidden="{hidden}">
  <Sidebar />
  <!--  Main  -->
  <main class="panel-content">
    <Navbar />

    <Router hidden="{showLoading}" config="{RouterConfig}" />

    <PageLoading show="{showLoading}" />
  </main>
</div>

<script>
  import Navbar from "./Navbar.svelte";
  import Sidebar from "./Sidebar.svelte";
  import Router, { isPageLoading, beforeRouteEnter } from "routve";
  import RouterConfig from "../router.config";
  import PageLoading from "./PageLoading.svelte";

  import { onDestroy } from "svelte";
  import { get } from "svelte/store";

  import { isPageInitialized } from "../Store";

  let showLoading = true;

  const isPageInitializedUnsubscribe = isPageInitialized.subscribe((value) => {
    showLoading = !(value && !get(isPageLoading));
  });

  const isPageLoadingUnsubscribe = isPageLoading.subscribe((value) => {
    showLoading = !(!value && get(isPageInitialized));
  });

  let beforeRoutePath = null;

  const beforeRouteEnterHandler = beforeRouteEnter((context, next) => {
    if (beforeRoutePath !== context.pathname) isPageInitialized.set(false);

    beforeRoutePath = context.pathname;

    next();
  });

  onDestroy(isPageInitializedUnsubscribe);
  onDestroy(isPageLoadingUnsubscribe);
  onDestroy(beforeRouteEnterHandler);

  export let hidden;
</script>
