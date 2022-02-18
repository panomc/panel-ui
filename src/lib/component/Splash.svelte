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
    class="animate__animated animate__pulse animate__infinite animate__slower"
    alt="Pano"
    src="{base + '/assets/img/logo-blue.svg'}"
    width="32"
  />

  {#if networkErrors}
    <div
      class="pt-4 d-flex flex-column
      justify-content-center align-items-center text-center"
    >
      {#if $notLoggedIn}
        <p class="text-danger">
          Panele erişmek için lütfen <a
            href="http://localhost:3000/"
            class="font-weight-bolder text-danger"
            target="_blank">giriş yap</a
          >.
        </p>
      {:else}
        <p class="text-danger">Bağlantı hatası!</p>
      {/if}
      <button
        class="btn btn-outline-primary"
        on:click="{onResumeClick}"
        class:disabled="{$retryingNetworkErrors}"
        disabled="{$retryingNetworkErrors}"
      >
        {$retryingNetworkErrors ? "Yenileniyor..." : "Yenile"}
      </button>
    </div>
  {/if}
</div>

<script>
  import { base } from "$app/paths";
  import { onDestroy } from "svelte";
  import { fade } from "svelte/transition";

  import {
    networkErrorCallbacks,
    resumeAfterNetworkError,
    retryingNetworkErrors,
    notLoggedIn,
  } from "$lib/store";

  let networkErrors = false;

  onDestroy(
    networkErrorCallbacks.subscribe((value) => {
      networkErrors = value.length !== 0;
    })
  );

  function onResumeClick() {
    resumeAfterNetworkError();
  }
</script>
