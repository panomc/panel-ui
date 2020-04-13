<script>
  import { onMount, onDestroy } from "svelte";
  import { get } from "svelte/store";
  import {
    isPageInitialized,
    getBasicData,
    networkErrorCallbacks,
    showNetworkErrorOnCatch
  } from "./Store";

  import Splash from "./components/Splash.svelte";

  let showSplash = true;
  let waitAnimation = true;
  let basicDataInitialized = false;

  const isPageInitializedUnsubscribe = isPageInitialized.subscribe(value => {
    if (
      value &&
      !waitAnimation &&
      basicDataInitialized &&
      get(networkErrorCallbacks).length === 0
    ) {
      showSplash = false;
    }
  });

  const networkErrorCallbacksUnsubscribe = networkErrorCallbacks.subscribe(
    value => {
      if (!showSplash && value.length !== 0) {
        showSplash = true;
      } else if (
        showSplash &&
        value.length === 0 &&
        !waitAnimation &&
        basicDataInitialized &&
        get(isPageInitialized)
      ) {
        showSplash = false;
      }
    }
  );

  onDestroy(isPageInitializedUnsubscribe);
  onDestroy(networkErrorCallbacksUnsubscribe);

  onMount(async () => {
    setTimeout(function() {
      waitAnimation = false;

      if (
        showSplash &&
        get(isPageInitialized) &&
        basicDataInitialized &&
        get(networkErrorCallbacks).length === 0
      ) {
        showSplash = false;
      }
    }, 1500);
  });

  let first = true;

  showNetworkErrorOnCatch(
    () =>
      new Promise((resolve, reject) => {
        getBasicData()
          .then(() => {
            basicDataInitialized = true;

            if (
              showSplash &&
              get(isPageInitialized) &&
              !waitAnimation &&
              get(networkErrorCallbacks).length === 0
            ) {
              showSplash = false;
            }

            resolve();
          })
          .catch(() => {
            reject();
          });
      })
  );
</script>

<style lang="scss" global>
  @import "styles/style";
</style>

<!-- Splash Animation -->
{#if showSplash}
  <Splash />
{/if}

<!-- Main Contents Hidden -->
{#await import('./components/Main.svelte') then MainComponent}
  <svelte:component this={MainComponent.default} hidden={showSplash} />
{/await}
