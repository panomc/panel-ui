<svelte:head>
  {#if networkErrors}
    <style>
      .show {
        display: none !important;
      }
    </style>
  {/if}
</svelte:head>

<div
  class="d-flex align-items-center justify-content-center vh-100 w-100 flex-column text-danger"
  role="status"
  in:fade
  out:fade>
  <img
    alt="Pano"
    src="/assets/img/loading_slime.gif"
    width="128"
    height="auto" />

  {#if networkErrors}
    {#if notLoggedIn}
      Oturum hatası
    {:else if noPermission}
      Yetki hatası
    {:else}
      Bağlantı hatası
    {/if}
    <button
      class="btn btn-primary mt-3"
      on:click="{onResumeClick}"
      class:disabled="{$retryingNetworkErrors}">
      {$retryingNetworkErrors ? "Yenileniyor..." : "Yenile"}
    </button>
  {/if}
</div>

<script>
  import { getContext, onDestroy } from "svelte";
  import { fade } from "svelte/transition";

  import { base } from "$app/paths";

  import {
    networkErrorCallbacks,
    resumeAfterNetworkError,
    retryingNetworkErrors,
  } from "$lib/Store";

  let networkErrors = false;

  const session = getContext("session");

  $: basicData = $session.basicData;

  $: notLoggedIn = basicData.error === "NOT_LOGGED_IN";
  $: noPermission = basicData.error === "NO_PERMISSION";

  onDestroy(
    networkErrorCallbacks.subscribe((value) => {
      networkErrors = value.length !== 0;
    })
  );

  async function onResumeClick() {
    if (notLoggedIn || noPermission) {
      location.reload();

      return;
    }

    await resumeAfterNetworkError();
  }
</script>
