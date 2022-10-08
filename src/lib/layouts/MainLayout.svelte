<svelte:head>
  <title>{title}</title>
</svelte:head>

<App>
  {#if showSplash}
    <Splash />
  {/if}

  <div class:d-flex="{!showSplash}" hidden="{showSplash}">
    <Sidebar />
    <!--  Main  -->
    <main class="w-100 overflow-scroll" style="height: 100vh;">
      <Navbar />

      <div hidden="{showLoading}">
        <slot />
      </div>

      <PageLoading show="{showLoading}" />
    </main>
  </div>

  <NotificationContainer />
  <ToastContainer />
</App>

<script context="module">
  import {
    initializeBasicData,
    networkErrorCallbacks,
    showNetworkErrorOnCatch,
    notLoggedIn,
    setDefaults,
    session,
  } from "$lib/Store.js";
  import { init as initLanguage } from "$lib/language.util";

  import ApiUtil, { NETWORK_ERROR } from "$lib/api.util.js";

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
   * @type {import('@sveltejs/kit').LayoutServerLoad}
   */
  export async function loadServer({ locals: { basicData, CSRFToken } }) {
    return { basicData, CSRFToken };
  }

  /**
   * @type {import('@sveltejs/kit').LayoutLoad}
   */
  export async function load(event) {
    const {
      data: { basicData, CSRFToken },
    } = event;

    session.set({ basicData, CSRFToken });

    await initLanguage(basicData.locale);

    setDefaults();

    const output = {
      stuff: {},
    };

    if (basicData.result === "ok") {
      initializeBasicData(basicData);
    } else {
      if (basicData.error === "NOT_LOGGED_IN") {
        notLoggedIn.set(true);
      }

      output.stuff.NETWORK_ERROR = true;

      showNetworkErrorOnCatch((resolve, reject) => {
        getBasicData({ request: event })
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

  import { pageTitle, options, logoutLoading } from "$lib/Store";

  import Splash from "$lib/component/Splash.svelte";
  import Navbar from "$lib/component/Navbar.svelte";
  import Sidebar from "$lib/component/Sidebar.svelte";
  import PageLoading from "$lib/component/PageLoading.svelte";
  import App from "$lib/component/App.svelte";
  import NotificationContainer from "$lib/component/NotificationContainer.svelte";
  import ToastContainer from "$lib/component/ToastContainer.svelte";

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
