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
  {#if hasPermission(Permissions.MANAGE_SERVERS)}
    <ServerRequestModal />
  {/if}
</App>

<script context="module">
  import { writable } from "svelte/store";

  import { goto } from "$app/navigation";
  import { base } from "$app/paths";
  import { browser } from "$app/environment";

  import { PanelSidebarStorageUtil } from "$lib/storage.util.js";
  import { hasPermission, Permissions } from "$lib/auth.util.js";
  import { init as initLanguage } from "$lib/language.util";

  import { networkErrorCallbacks } from "$lib/Store.js";

  import { addListener } from "$lib/NotificationManager.js";

  import { show as showServerRequestModal } from "$lib/component/modals/ServerRequestModal.svelte";

  function initNotificationListeners() {
    addListener("NEW_TICKET", (notification) => {
      const {
        properties: { id },
      } = notification;

      goto(base + "/tickets/ticket/" + id, { invalidateAll: true });
    });

    addListener("NEW_TICKET_MESSAGE", (notification) => {
      const {
        properties: { id },
      } = notification;

      goto(base + "/tickets/ticket/" + id, { invalidateAll: true });
    });

    addListener("TICKET_CLOSED_BY_USER", (notification) => {
      const {
        properties: { id },
      } = notification;

      goto(base + "/tickets/ticket/" + id, { invalidateAll: true });
    });

    addListener("SERVER_CONNECT_REQUEST", (notification) => {
      const {
        properties: { id },
      } = notification;

      showServerRequestModal(id);
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
      parent,
    } = event;
    await parent();

    await initLanguage(basicData.locale);

    if (browser) {
      initNotificationListeners();
    }

    const output = {
      session: writable({ basicData, CSRFToken }),
      pageTitle: writable(null),
      user: writable({}),
      website: writable({}),
      platformServerMatchKey: writable(""),
      platformKeyRefreshedTime: writable(Date.now()),
      platformHostAddress: writable(""),
      notificationCount: writable(0),
      mainServer: writable({}),
      selectedServer: writable(null),
      sidebarTabsState: writable(
        PanelSidebarStorageUtil.isThereSideBarTabsState()
          ? PanelSidebarStorageUtil.getSidebarTabsState()
          : "website"
      ),
      isSidebarOpen: writable(
        PanelSidebarStorageUtil.isThereSideBarOpenStatus()
          ? PanelSidebarStorageUtil.getSidebarOpenStatus()
          : true
      ),
    };

    if (basicData.result === "ok") {
      const {
        user,
        website,
        platformServerMatchKey,
        platformServerMatchKeyTimeStarted,
        platformHostAddress,
        notificationCount,
        mainServer,
        selectedServer,
      } = basicData;

      output.user.set(user);
      output.website.set(website);
      output.platformServerMatchKey.set(platformServerMatchKey);
      output.platformKeyRefreshedTime.set(platformServerMatchKeyTimeStarted);
      output.platformHostAddress.set(platformHostAddress);
      output.notificationCount.set(notificationCount);
      output.mainServer.set(mainServer || {});

      if (!hasPermission(Permissions.MANAGE_SERVERS, output.user)) {
        output.sidebarTabsState.set("website");
      }

      output.selectedServer.set(selectedServer ? selectedServer : mainServer);
    } else {
      output.NETWORK_ERROR = true;
    }

    return output;
  }
</script>

<script>
  import { onDestroy, onMount } from "svelte";
  import { get } from "svelte/store";

  import { options, logoutLoading } from "$lib/Store";

  import Splash from "$lib/component/Splash.svelte";
  import Navbar from "$lib/component/Navbar.svelte";
  import Sidebar from "$lib/component/Sidebar.svelte";
  import PageLoading from "$lib/component/PageLoading.svelte";
  import App from "$lib/component/App.svelte";
  import NotificationContainer from "$lib/component/NotificationContainer.svelte";
  import ToastContainer from "$lib/component/ToastContainer.svelte";
  import ServerRequestModal from "$lib/component/modals/ServerRequestModal.svelte";

  export let data;

  const { pageTitle } = data;

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
