<style lang="scss" global>
  @import "../styles/style";
</style>

<svelte:head>
  <title>{title}</title>
</svelte:head>

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
  import {
    initializeBasicData,
    networkErrorCallbacks,
    showNetworkErrorOnCatch,
    notLoggedIn,
    setDefaults,
  } from "$lib/store";

  import ApiUtil, { NETWORK_ERROR } from "$lib/api.util";

  function getBasicData({ request, CSRFToken }) {
    return new Promise((resolve, reject) => {
      ApiUtil.get({ path: "/api/panel/basicData", request, CSRFToken })
        .then((body) => {
          if (body.result === "ok") {
            initializeBasicData(body);

            resolve(body);
          } else {
            reject(body);
          }
        })
        .catch(() => {
          reject(NETWORK_ERROR);
        });
    });
  }

  /**
   * @type {import('@sveltejs/kit').Load}
   */
  export async function load(request) {
    setDefaults();

    const output = {
      stuff: {},
    };

    if (request.session.basicData.result === "ok") {
      initializeBasicData(request.session.basicData);
    } else {
      if (request.session.basicData.error === "NOT_LOGGED_IN") {
        notLoggedIn.set(true);
      }

      output.stuff.NETWORK_ERROR = true;

      showNetworkErrorOnCatch((resolve, reject) => {
        getBasicData({ request })
          .then(() => {
            resolve();
          })
          .catch((body) => {
            if (body.error === "NOT_LOGGED_IN") {
              notLoggedIn.set(true);
            }

            reject();
          });
      }, true);
    }

    return output;
  }
</script>

<script>
  import { onDestroy, onMount } from "svelte";
  import { get } from "svelte/store";

  import { browser } from "$app/env";

  import { pageTitle, options } from "$lib/store";

  if (browser) {
    import("$lib/init.libs");
  }

  import { logoutLoading } from "$lib/store";

  import Splash from "$lib/component/Splash.svelte";
  import Navbar from "$lib/component/Navbar.svelte";
  import Sidebar from "$lib/component/Sidebar.svelte";
  import PageLoading from "$lib/component/PageLoading.svelte";

  $: title = $pageTitle
    ? `${$pageTitle} \u2014 ${options.DEFAULT_PAGE_TITLE}`
    : options.DEFAULT_PAGE_TITLE;

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
