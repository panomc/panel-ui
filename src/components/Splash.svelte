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
    class="animated fadeIn infinite slow"
    alt="Pano"
    src="{base + '/assets/img/logo-blue.svg'}"
    width="32"
  />

  {#if networkErrors}
    <div
      class="pt-4 animated bounceInUp fast d-flex flex-column
      justify-content-center align-items-center"
    >
      {#if $notLoggedIn}
        <p class="text-danger">
          Giriş yapılmamış!<br />Lütfen önce <strong>tema</strong>'dan giriş yapın!
        </p>
      {:else}
        <p class="text-danger">Bağlantı hatası!</p>
      {/if}
      <button
        class="btn btn-link bg-lightprimary btn-sm"
        on:click="{onResumeClick}"
        class:disabled="{$retryingNetworkErrors}"
        disabled="{$retryingNetworkErrors}"
      >
        {$retryingNetworkErrors ? "Tekrar deneniyor..." : "Tekrar Dene"}
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
