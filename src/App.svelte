<script>
  import {onMount, onDestroy} from "svelte"
  import {isPageInitialized} from "./Store"

  import Splash from "./components/Splash.svelte"

  let showSplash = true;
  let waitAnimation = true;

  const isPageInitializedUnsubscribe = isPageInitialized.subscribe(value => {
    if (value && !waitAnimation)
      showSplash = false;
  });

  onDestroy(isPageInitializedUnsubscribe)

  onMount(async () => {
    setTimeout(function () {
      waitAnimation = false;

      if (showSplash && $isPageInitialized)
        showSplash = false;
    }, 1500);
  });

</script>

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
