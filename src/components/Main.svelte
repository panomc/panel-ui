<script>
  import Navbar from "./Navbar.svelte";
  import Sidebar from "./Sidebar.svelte";
  import Router from "./Router.svelte";
  import PageLoading from "./PageLoading.svelte";

  import {onDestroy} from "svelte";
  import {get} from "svelte/store";

  import {isPageLoading} from "../RouterStore";
  import {isPageInitialized} from "../Store";

  let showLoading = true;

  const isPageInitializedUnsubscribe = isPageInitialized.subscribe(value => {
    showLoading = !(value && !get(isPageLoading));
  });

  const isPageLoadingUnsubscribe = isPageLoading.subscribe(value => {
    showLoading = !(!value && get(isPageInitialized));
  });

  onDestroy(isPageInitializedUnsubscribe);
  onDestroy(isPageLoadingUnsubscribe);

  export let hidden;
</script>

<div class:d-flex={!hidden} hidden={hidden}>
  <Sidebar/>
  <!--  Main  -->
  <main class="panel-content">
    <Navbar/>

    <Router hidden={showLoading}/>

    <PageLoading show={showLoading}/>
  </main>
</div>