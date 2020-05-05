<script>
  import { isPageInitialized } from "../Store";
  isPageInitialized.set(true);
  import Icon from "svelte-awesome";
  import { faDotCircle } from "@fortawesome/free-regular-svg-icons";
</script>

<div class="content">
  <!-- Action Menu -->
  <div class="row mb-3">
    <div class="col-md-4 col-6">
      <h3 class="text-muted badge badge-lightprimary panel-subtitle">
        Bildirimler
      </h3>
    </div>
    <div class="col text-right">
      <button type="button" class="btn btn-link text-danger">
        <span class="d-md-inline d-none">Tümünü Sil</span>
      </button>
    </div>
  </div>

  <!-- All Notifications -->

  <div class="card">
    <div class="card-body">
      <div class="border rounded">
        <a
          href="javascript:void(0);"
          class="dropdown-item d-flex flex-row border-bottom py-2">
          <!-- class:notification-unread={notification.status === 'NOT_READ'} -->
          <div class="col-auto pl-0">
            <Icon data={faDotCircle} class="text-primary" />
          </div>
          <div class="col">
            <span class="text-wrap text-dark">dsadsadas</span>
            <!-- {notification.type_ID} -->
            <small class="text-gray d-block">
              <!-- {moment(notification.date).fromNow()} -->
            </small>
          </div>
        </a>
        <a
          href="javascript:void(0);"
          class="dropdown-item d-flex flex-row border-bottom py-2">
          <!-- class:notification-unread={notification.status === 'NOT_READ'} -->
          <div class="col-auto pl-0">
            <Icon data={faDotCircle} class="text-primary" />
          </div>
          <div class="col">
            <span class="text-wrap text-dark">dsadsadas</span>
            <!-- {notification.type_ID} -->
            <small class="text-gray d-block">
              <!-- {moment(notification.date).fromNow()} -->
            </small>
          </div>
        </a>
        <a
          href="javascript:void(0);"
          class="dropdown-item d-flex flex-row border-bottom py-2">
          <!-- class:notification-unread={notification.status === 'NOT_READ'} -->
          <div class="col-auto pl-0">
            <Icon data={faDotCircle} class="text-primary" />
          </div>
          <div class="col">
            <span class="text-wrap text-dark">dsadsadas</span>
            <!-- {notification.type_ID} -->
            <small class="text-gray d-block">
              <!-- {moment(notification.date).fromNow()} -->
            </small>
          </div>
        </a>
      </div>
    </div>
  </div>

</div>
