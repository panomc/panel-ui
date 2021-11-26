<style lang="scss" global>
  @import "../styles/style";
</style>

{#if showSplash}
  <Splash />
{/if}

<div class:d-flex="{!showSplash}" hidden="{showSplash}">
  <Sidebar />
  <!--  Main  -->
  <main class="panel-content">
    <Navbar />

    <div hidden="{showLoading}">
      <slot />
    </div>

    <PageLoading show="{showLoading}" />
  </main>
</div>

<script context="module">
  import ApiUtil from "$lib/api.util";
  import { API_URL } from "$lib/variables";

  import {
    getBasicData,
    initializeBasicData,
    networkErrorCallbacks,
    showNetworkErrorOnCatch,
    notLoggedIn,
  } from "$lib/store";

  /**
   * @type {import('@sveltejs/kit').Load}
   */
  export async function load({ session }) {
    ApiUtil.init(API_URL);

    if (session.basicData.result === "ok") {
      initializeBasicData(session.basicData);
    } else {
      if (session.basicData.error === "NOT_LOGGED_IN") {
        notLoggedIn.set(true);
      }

      showNetworkErrorOnCatch((resolve, reject) => {
        getBasicData(session.initialRequest)
          .then(() => {
            resolve();
          })
          .catch((errorCode) => {
            if (errorCode === "NOT_LOGGED_IN") {
              notLoggedIn.set(true);
            }

            reject();
          });
      }, true);
    }

    return {};
  }
</script>

<script>
  import { onDestroy, onMount } from "svelte";
  import { get } from "svelte/store";

  import { browser } from "$app/env";

  if (browser) {
    import("$lib/init.libs");
  }

  import { logoutLoading } from "$lib/store";

  import Splash from "../components/Splash.svelte";
  import Navbar from "../components/Navbar.svelte";
  import Sidebar from "../components/Sidebar.svelte";
  import PageLoading from "../components/PageLoading.svelte";

  let showSplash = true;
  let showSplashAlways = false;
  let showLoading = false;
  let waitAnimation = true;
  let mounted = false;

  setTimeout(function () {
    waitAnimation = false;

    if (
      !showSplashAlways &&
      get(networkErrorCallbacks).length === 0 &&
      !get(logoutLoading) &&
      mounted
    ) {
      showSplash = false;
    }
  }, 1500);

  onMount(() => {
    mounted = true;

    if (
      !showSplashAlways &&
      get(networkErrorCallbacks).length === 0 &&
      !get(logoutLoading) &&
      !waitAnimation
    ) {
      showSplash = false;
    }
  });

  onDestroy(
    networkErrorCallbacks.subscribe((value) => {
      if (!showSplash && value.length !== 0) {
        showSplash = true;
      } else if (
        showSplash &&
        value.length === 0 &&
        !waitAnimation &&
        !get(logoutLoading) &&
        !showSplashAlways &&
        mounted
      ) {
        showSplash = false;
      }
    })
  );
</script>
