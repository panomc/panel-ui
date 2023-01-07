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
    src="{base + (networkErrors ? '' : '/assets/img/loading_slime.gif')}"
    width="128"
    height="auto" />

  {#if networkErrors}
    <div
      class="pt-4 d-flex flex-column
      justify-content-center align-items-center text-center">
      {#if $notLoggedIn}
        <p class="text-danger">
          Panele erişmek için lütfen <a
            href="http://localhost:3000/"
            class="font-weight-bolder text-danger"
            target="_blank">giriş yap</a
          >.
        </p>
      {:else}
        <p class="text-danger">
          Bağlantı hatası!
          <br />Lütfen internetinizi veya Pano'nun açık ve erişilebilir olmasını
          kontrol edin!
        </p>
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
  import { base } from "$app/paths";
  import { onDestroy } from "svelte";
  import { fade } from "svelte/transition";

  import {
    networkErrorCallbacks,
    resumeAfterNetworkError,
    retryingNetworkErrors,
    notLoggedIn,
  } from "$lib/Store";

  let networkErrors = false;

  onDestroy(
    networkErrorCallbacks.subscribe((value) => {
      networkErrors = value.length !== 0;
    })
  );

  async function onResumeClick() {
    await resumeAfterNetworkError();
  }
</script>
