<svelte:head>
  {#if networkErrors}
    <style>
      .show {
        display: none !important;
      }
    </style>
  {/if}
</svelte:head>

<div class="splash" role="status" in:fade out:fade>
  <img
    alt="Pano"
    src="{base +
      (networkErrors
        ? '/assets/img/logo-blue.svg'
        : '/assets/img/loading_slime.gif')}"
    width="{networkErrors ? '32' : '128'}"
    height="auto" />

  {#if networkErrors}
    <div
      class="pt-4 d-flex flex-column
      justify-content-center align-items-center text-center">
      {#if notLoggedIn}
        <p>
          <a href="http://localhost:3000/" target="_blank">Oturum hatası</a>
        </p>
      {:else if noPermission}
        <p class="text-danger">Yetki hatası</p>
      {:else}
        <p class="text-danger">Bağlantı hatası</p>
      {/if}
      <button
        class="btn btn-outline-primary"
        on:click="{onResumeClick}"
        class:disabled="{$retryingNetworkErrors}">
        {$retryingNetworkErrors ? "Yenileniyor..." : "Yenile"}
      </button>
    </div>
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
