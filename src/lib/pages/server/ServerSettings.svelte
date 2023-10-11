<!-- Site Settings Sub Page -->
<div class="card bg-white animate__animated animate__fadeIn">
  <div class="card-body">
    <h5 class="card-title">
      {$selectedServer.name} ({$selectedServer.host}:{$selectedServer.port})
    </h5>
    <div class="row mb-3">
      <label class="col-md-4 col-form-label" for="mainServer">
        Ana Sunucu
      </label>
      <div class="col col-form-label">
        {#if $selectedServer.id === $mainServer.id}
          <p class="mb-0 text-muted">
            <i class="fa-solid fa-check me-2"></i> {$selectedServer.name} ana sunucu
          </p>
        {:else}
          <a
            href="javascript:void(0);"
            on:click="{() => showMakeMainServerModal($selectedServer)}"
            class="btn btn-link ps-0"
            ><i class="fa-solid fa-home me-2"></i> Ana Sunucu Belirle</a>

          <small class="text-muted d-block"
            >Websitede görüntülenecek sunucu bilgilerini ana sunucu belirler.</small>
        {/if}
      </div>
    </div>
    <div class="row py-3 rounded my-3 bg-danger bg-opacity-25">
      <label class="col-md-4 col-form-label" for="removeServer">
        Sunucuyu Kaldır
      </label>
      <div class="col d-flex align-items-center">
        <a href="javascript:void(0);" on:click={() => showRemoveServerModal($selectedServer)} class="btn btn-link link-danger ps-0"
          ><i class="fa-solid fa-plug me-2"></i> Bağlantıyı Kes</a>
      </div>
    </div>
  </div>
</div>

<MakeMainServerModal/>
<RemoveServerModal />

<script>
  import { getContext } from "svelte";

  import MakeMainServerModal, { show as showMakeMainServerModal } from "$lib/component/modals/MakeMainServerModal.svelte";
  import RemoveServerModal, { show as showRemoveServerModal } from "$lib/component/modals/RemoveServerModal.svelte";

  const mainServer = getContext("mainServer");
  const selectedServer = getContext("selectedServer");
  const pageTitle = getContext("pageTitle");

  pageTitle.set("Sunucu Ayarları");
</script>
