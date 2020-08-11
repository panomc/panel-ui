<script>
  import { isPageInitialized } from "../../Store";

  import Icon from "svelte-awesome";
  import { faTicketAlt } from "@fortawesome/free-solid-svg-icons";

  isPageInitialized.set(true);
</script>

<div class="card">
  <div class="card-body">
    <div class="row">
      <div class="d-lg-flex align-items-center d-none">
        <div class="text-center">
          <Icon data="{faTicketAlt}" scale="2.5" class="text-glass m-3" />
        </div>
      </div>
      <div class="col">
        <h5 class="card-title">
          <a href="#" class="mr-2">#1</a>
          Lagdan öldüm itemlerim gitti, lütfen ilgilenebilir misiniz?
        </h5>
        <p class="text-muted">
          <b>2 gün önce</b>
          ,
          <b>Genel</b>
          kategorisine açıldı.
        </p>
      </div>
      <div class="col-auto ml-auto">
        <span class="badge badge-secondary badge-pill">Yeni</span>
      </div>
    </div>

    <hr />

    <div class="card-body rounded border">

      <div class="media mb-3">
        <img
          src="https://minotar.net/avatar/e5eea5f735c444a28af9b2c867ade454/64"
          class="mr-3 border rounded-circle"
          alt="Butlu"
          width="48"
          height="48"
        />
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
        <img
          src="https://minotar.net/avatar/e5eea5f735c444a28af9b2c867ade454/64"
          class="ml-3 border rounded-circle"
          alt="Admin"
          width="48"
          height="48"
        />
      </div>

    </div>
  </div>
</div>
