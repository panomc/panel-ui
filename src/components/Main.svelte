<script>
  import Navbar from "./Navbar.svelte";
  import Sidebar from "./Sidebar.svelte";
  import Router from "./Router.svelte"

  export let hidden;
</script>

<style lang="scss" global>
  @import "../styles/main";
</style>

<div class="d-flex" hidden={hidden}>
  <Sidebar/>
  <!--  Main  -->
  <main class="panel-content">
    <Navbar/>

    <!-- Content  -->
    <!--    <router-view-->
    <!--            v-show="!routePageLoading && !initialPageDataLoading"-->
    <!--    ></router-view>-->
    <Router/>

    <!--    <div-->
    <!--            :class="{ 'd-flex': routePageLoading || initialPageDataLoading }"-->
    <!--            class="align-items-center justify-content-center w-100 h-75"-->
    <!--            v-show="routePageLoading"-->
    <!--    >-->
    <!--      <div class="spinner-border text-primary" role="status"></div>-->
    <!--    </div>-->
  </main>
</div>