<script>
  import { isPageInitialized } from "../Store";

  import Icon from "svelte-awesome";
  import { faPlus, faCog } from "@fortawesome/free-solid-svg-icons";

  isPageInitialized.set(true);
</script>

<!-- Admins Page -->

<div class="content">
  <!-- Action Menu -->
  <div class="row mb-3">
    <div class="col-md-4 col-6" />
    <div class="col text-right">
      <router-link
        class="btn btn-primary"
        role="button"
        to="/panel/posts/create-post">
        <Icon data={faPlus} class="mr-2" />
        <span class="d-md-inline d-none">Yönetici Ekle</span>
      </router-link>
    </div>
  </div>

  <!-- Admin Cards -->
  <div class="row">
    <div class="col-lg-4 col-md-6 col-12">
      <div class="card">
        <div class="card-body">
          <div class="row">
            <div class="col-auto">
              <img
                alt="Butlu"
                class="rounded-circle border float-left"
                height="48"
                src="https://minotar.net/avatar/e5eea5f735c444a28af9b2c867ade454/64"
                width="48" />
            </div>
            <div class="col">
              <h4 class="card-title">Butlu</h4>
              <small class="badge badge-primary badge-pill">Admin</small>
            </div>
          </div>

          <hr />

          <a
            class="btn btn-outline-primary btn-sm float-right"
            role="button"
            href="/">

            <Icon data={faCog} class="mr-2" />
            Yönet
          </a>
        </div>
      </div>
    </div>
  </div>
</div>
