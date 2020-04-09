<script>
  import router from "page";
  import page from "page"
  import {ChunkGenerator} from "svelte-spa-chunk";

  import {basePath} from "./util/path.util";

  import ChunkComponent from "./Chunk.svelte";
  import {isPageLoading} from "./ChunkStore";

  import PageLoading from "./components/PageLoading.svelte";
  import Navbar from "./components/Navbar.svelte"

  const Chunk = ChunkGenerator(ChunkComponent);

  let props = {};
  let showSplash = false;

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

<!-- Splash Animation -->
{#if showSplash}
  <div class="d-flex justify-content-center align-items-center w-100 min-vh-100" role="status">
    <img class="animated fadeIn infinite slow" src={basePath() + "assets/img/logo-blue.svg"} width="32">
  </div>
{/if}


  <!-- Main Contents Hidden -->
<!--{#if !showSplash}-->
<div hidden={showSplash}>
  <!--  :class="{ 'd-flex': !showSplash }"-->
  <!--  <Main v-show="!showSplash"></Main>-->


  <!--    <Sidebar/>-->
  <!--  Main  -->
  <main class="panel-content">
    <Navbar/>

    <!-- Content  -->
    <!--    <router-view-->
    <!--            v-show="!routePageLoading && !initialPageDataLoading"-->
    <!--    ></router-view>-->
    <svelte:component this={props.component} {...props}/>

    <!--    <div-->
    <!--            :class="{ 'd-flex': routePageLoading || initialPageDataLoading }"-->
    <!--            class="align-items-center justify-content-center w-100 h-75"-->
    <!--            v-show="routePageLoading"-->
    <!--    >-->
    <!--      <div class="spinner-border text-primary" role="status"></div>-->
    <!--    </div>-->
  </main>
</div>
<!--{/if}-->


<!--{#if $isPageLoading}-->
<!--  <PageLoading/>-->
<!--{/if}-->
