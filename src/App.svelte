<script>
  import {onMount, onDestroy} from "svelte"
  import {isPageInitialized, getBasicData} from "./Store"

  import Splash from "./components/Splash.svelte"

  let showSplash = true;
  let waitAnimation = true;
  let basicDataInitialized = false;

  const isPageInitializedUnsubscribe = isPageInitialized.subscribe(value => {
    if (value && !waitAnimation && basicDataInitialized)
      showSplash = false;
  });

  onDestroy(isPageInitializedUnsubscribe)

  onMount(async () => {
    setTimeout(function () {
      waitAnimation = false;

      if (showSplash && $isPageInitialized && basicDataInitialized)
        showSplash = false;
    }, 1500);
  });

  getBasicData()
    .then(() => {
      basicDataInitialized = true;

      if (showSplash && $isPageInitialized && !waitAnimation)
        showSplash = false;
    })
    .catch(() => {
    })

</script>

<style lang="scss" global>
  @import "styles/main";
</style>

<!-- Splash Animation -->
{#if showSplash}
  <Splash/>
{/if}

  <!-- Main Contents Hidden -->
{#await import('./components/Main.svelte') then MainComponent}
  <svelte:component this={MainComponent.default} hidden={showSplash}/>
{/await}

  <!--{#if $isPageLoading}-->
<!--  <PageLoading/>-->
<!--{/if}-->
