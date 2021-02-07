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
    faRedo,
    faEllipsisV,
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
    <a class="btn btn-outline-danger" role="button" href="javascript:void(0);">
      <Icon data="{faTrash}" class="mr-1" />
      Talebi Sil
    </a>
  </div>
</div>

<h3 class="text-muted badge badge-lightprimary panel-subtitle">Talep: #1</h3>

<div class="card border border-success mb-3">
  <div class="card-body">
    <div class="row">
      <div class="col">
        <h5 class="card-title">Lagdan öldüm, itemlerim gitti!1!11</h5>
        <a href="#">noob44</a> tarafından, 31.06.2023 tarihinde,
        <a href="#">Genel</a>
        kategorisine açıldı.
        <hr />
      </div>
      <div class="col-auto ml-auto">
        <div class="dropdown">
          <button
            type="button"
            class="btn bg-secondary text-white rounded-pill dropdown-toggle"
            data-bs-toggle="dropdown"
            aria-expanded="false">
            Yeni
          </button>
          <ul class="dropdown-menu">
            <li><a class="dropdown-item" href="#">Talebi Kapat</a></li>
            <li><a class="dropdown-item" href="#">Talabi Aç</a></li>
          </ul>
        </div>
      </div>
    </div>

    <div class="card-body messages-section">
      <button class="btn text-primary bg-lightprimary d-block m-auto"
        >Eski Mesajları Göster
      </button>

      <div class="row py-3 flex-nowrap">
        <div class="col-2 text-right">
          <a href="#">
            <img
              src="https://minotar.net/avatar/e5eea5f735c444a28af9b2c867ade454/64"
              class="mr-3 border rounded-circle"
              alt="Butlu"
              width="48"
              height="48" />
          </a>
        </div>
        <div class="col d-flex flex-nowrap align-items-center">
          <div class="p-2 rounded bg-lightprimary border d-inline-block">
            <div class="pb-2 text-black">
              Lorem ipsum dolor sit, amet consectetur adipisicing elit. Rem
              magni sapiente minus repellendus repellat totam inventore
              perferendis accusamus mollitia! Non quam animi cum atque quaerat
              aspernatur. Asperiores iure id accusantium? 🚓
            </div>
            <small class="text-muted pt-2">0 saat önce</small>
          </div>
          <a
            class="btn btn-link d-none ml-3"
            role="button"
            href="javascript:void(0);">
            <Icon data="{faEllipsisV}" />
          </a>
        </div>
        <div class="col-2"></div>
      </div>

      <div class="row py-3 flex-nowrap">
        <div class="col-2 d-flex justify-content-end"></div>

        <div
          class="col d-flex flex-nowrap justify-content-end align-items-center">
          <a
            class="btn btn-link mr-3 d-none"
            role="button"
            href="javascript:void(0);">
            <Icon data="{faEllipsisV}" />
          </a>
          <div class="d-inline-block p-2 bg-lightsecondary border rounded">
            <div class="pb-2 text-black">Lorem ipsum dolor sit,</div>
            <small class="text-muted pt-2">0 saat önce</small>
          </div>
        </div>
        <div class="col-2">
          <a href="#">
            <img
              src="https://minotar.net/avatar/Butlu"
              class="ml-3 border rounded-circle d-block mr-auto"
              alt="Admin"
              width="48"
              height="48" />
          </a>
        </div>
      </div>
    </div>
  </div>
</div>

<div class="container text-center">
  <Icon data="{faTimes}" scale="3" class="text-glass m-3" />
  <p class="text-gray">Bu talep kapalı.</p>
</div>

<ConfirmCloseTicketModal />
<ConfirmDeleteTicketModal />
