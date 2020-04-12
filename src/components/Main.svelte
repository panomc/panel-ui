<script>
  import Navbar from "./Navbar.svelte";
  import Sidebar from "./Sidebar.svelte";
  import Router from "./Router.svelte";
  import PageLoading from "./PageLoading.svelte";

  import {isPageLoading} from "../ChunkStore";

  export let hidden;
</script>

<div class:d-flex={!hidden} hidden={hidden}>
  <Sidebar/>
  <!--  Main  -->
  <main class="panel-content">
    <Navbar/>

    <Router hidden={$isPageLoading}/>

    <PageLoading show={$isPageLoading}/>
  </main>
</div>