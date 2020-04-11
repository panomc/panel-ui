<script>
  import {onDestroy} from "svelte";

  import {basePath} from "../util/path.util";
  import {networkErrorCallbacks, resumeAfterNetworkError, retryingNetworkErrors} from "../Store";

  let networkErrors = false;

  const networkErrorCallbacksUnsubscribe = networkErrorCallbacks.subscribe(value => {
    networkErrors = value.length !== 0;
  });

  onDestroy(networkErrorCallbacksUnsubscribe);

  function onResumeClick() {
    resumeAfterNetworkError();
  }
</script>

<div
  class="d-flex justify-content-center align-items-center w-100 min-vh-100"
  role="status">
  <img
    class="animated fadeIn infinite slow"
    alt="Pano"
    src={basePath() + 'assets/img/logo-blue.svg'}
    width="32"/>

  <br/>

    {#if networkErrors}
      Network Error var!
      <br>
      <button class="btn btn-primary" on:click={onResumeClick} class:disabled={$retryingNetworkErrors}
              disabled={$retryingNetworkErrors}>{$retryingNetworkErrors ? "Retrying..." : "Retry Again"}</button>
    {/if}
</div>