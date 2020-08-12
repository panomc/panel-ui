<script>
  import { isPageInitialized } from "../../Store";

  import ConfirmCloseTicketModal from "../../components/modals/ConfirmCloseTicketModal.svelte";
  import ConfirmDeleteTicketModal from "../../components/modals/ConfirmDeleteTicketModal.svelte";

  import Icon from "svelte-awesome";
  import {
    faTicketAlt,
    faTrash,
    faTimes,
    faArrowLeft,
  } from "@fortawesome/free-solid-svg-icons";

  isPageInitialized.set(true);
</script>

<div class="row mb-3">
  <div class="col-auto">
    <a class="btn btn-link" role="button" href="/panel/tickets">
      <Icon data="{faArrowLeft}" class="mr-1" />
      Talepler
    </a>
  </div>
  <div class="col-auto ml-auto">
    <a
      class="btn btn-outline-bittersweet"
      role="button"
      href="javascript:void(0);"
    >
      <Icon data="{faTimes}" class="mr-1" />
      Kapat
    </a>
    <a class="btn btn-outline-danger" role="button" href="javascript:void(0);">
      <Icon data="{faTrash}" class="mr-1" />
      Sil
    </a>
  </div>
</div>

<h3 class="text-muted badge badge-lightprimary panel-subtitle">Talep: #1</h3>

<div class="card border border-success mb-3">
  <div class="card-body">
    <div class="row">
      <div class="col">
        <h5 class="card-title">
          Lagdan öldüm itemlerim gitti, lütfen ilgilenebilir misiniz?
        </h5>
        <div class="text-gray mb-3">
          <a href="#">Butlu</a> tarafından <a href="#">Genel</a> kategorisine açıldı.
        </div>
      </div>
      <div class="col-auto ml-auto">
        <span class="badge badge-secondary badge-pill">Yeni</span>
      </div>
    </div>

    <div class="card-body rounded border">

      <div class="media mb-3">
        <a href="#">
          <img
            src="https://minotar.net/avatar/e5eea5f735c444a28af9b2c867ade454/64"
            class="mr-3 border rounded-circle"
            alt="Butlu"
            width="48"
            height="48"
          />
        </a>
        <div class="media-body p-2 rounded bg-lightprimary shadow-sm">
          <div>
            Cras sit amet nibh libero, in gravida nulla. Nulla vel metus
            scelerisque ante sollicitudin. Cras purus odio, vestibulum in
            vulputate at, tempus viverra turpis. Fusce condimentum nunc ac nisi
            vulputate fringilla. Donec lacinia congue felis in faucibus.
          </div>
          <small class="text-muted pt-2">16 saat önce</small>
        </div>
      </div>

      <div class="media mb-3">
        <div class="media-body p-2 bg-lightsecondary rounded shadow-sm">
          <div>
            Cras sit amet nibh libero, in gravida nulla. Nulla vel metus
            scelerisque ante sollicitudin. Cras purus odio, vestibulum in
            vulputate at, tempus viverra turpis. Fusce condimentum nunc ac nisi
            vulputate fringilla. Donec lacinia congue felis in faucibus.
          </div>
          <small class="text-muted pt-2">16 saat önce</small>
        </div>
        <a href="#">
          <img
            src="https://minotar.net/avatar/e5eea5f735c444a28af9b2c867ade454/64"
            class="ml-3 border rounded-circle"
            alt="Admin"
            width="48"
            height="48"
          />
        </a>
      </div>

    </div>
  </div>
</div>

<div class="container text-center">
  <Icon data="{faTimes}" scale="3" class="text-glass m-3" />
  <p class="text-gray">Bu talep yanıtlara kapalı.</p>
</div>

<ConfirmCloseTicketModal />
<ConfirmDeleteTicketModal />
