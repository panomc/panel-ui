<script>
  import { onDestroy } from "svelte";

  import { basePath } from "../util/path.util";
  import {
    networkErrorCallbacks,
    resumeAfterNetworkError,
    retryingNetworkErrors
  } from "../Store";

  let networkErrors = false;

  const networkErrorCallbacksUnsubscribe = networkErrorCallbacks.subscribe(
    value => {
      networkErrors = value.length !== 0;
    }
  );

  onDestroy(networkErrorCallbacksUnsubscribe);

  function onResumeClick() {
    resumeAfterNetworkError();
  }
</script>

<div class="splash" role="status">
  <img
    class="animated fadeIn infinite slow"
    alt="Pano"
    src={basePath() + 'assets/img/logo-blue.svg'}
    width="32" />

  {#if networkErrors}
    <div
      class="pt-4 animated bounceInUp fast d-flex flex-column
      justify-content-center align-items-center">
      <p class="text-danger">Bağlantı hatası!</p>
      <button
        class="btn btn-link bg-lightprimary btn-sm"
        on:click={onResumeClick}
        class:disabled={$retryingNetworkErrors}
        disabled={$retryingNetworkErrors}>
        {$retryingNetworkErrors ? 'Tekrar deneniyor...' : 'Tekrar Dene'}
      </button>
    </div>
  {/if}
</div>
