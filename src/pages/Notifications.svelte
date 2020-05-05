<script>
  import Icon from "svelte-awesome";
  import moment from "moment";

  import {showNetworkErrorOnCatch, isPageInitialized} from "../Store";
  import ApiUtil from "../util/api.util";

  import {
    faBell,
    faDotCircle
  } from "@fortawesome/free-regular-svg-icons";

  let notificationProcessID = 0;
  let notifications = [];

  Array.prototype.insert = function (index, item) {
    this.splice(index, 0, item);

    return this;
  };

  Array.prototype.remove = function (index) {
    this.splice(index, 1);

    return this;
  };

  function setNotifications(newNotifications) {
    if (notifications.length === 0 || newNotifications.length === 0) {
      notifications = newNotifications;
    } else {
      const listOfFilterIsNotificationExists = [];

      newNotifications.forEach((item, index) => {
        listOfFilterIsNotificationExists[index] = notifications.filter(
          filterItem => filterItem.id === item.id
        );
      });

      newNotifications.forEach((item, index) => {
        if (listOfFilterIsNotificationExists[index].length === 0) {
          notifications = notifications.insert(index, item);
        }
      });

      notifications.forEach((item, index) => {
        const newArrayOfFilter = newNotifications.filter(
          filterItem => filterItem.id === item.id
        );

        if (newArrayOfFilter.length === 0) {
          notifications = notifications.remove(index);
        }
      });
    }
  }

  function getNotifications(id) {
    showNetworkErrorOnCatch(
      () =>
        new Promise((resolve, reject) => {
          ApiUtil.get("panel/notifications")
            .then(response => {
              if (notificationProcessID === id) {
                if (response.data.result === "ok") {
                  setNotifications(response.data.notifications)

                  isPageInitialized.set(true);
                }

                setTimeout(() => {
                  if (notificationProcessID === id) {
                    startNotificationsDown();
                  }
                }, 1000);
              }

              resolve();
            })
            .catch(() => {
              reject();
            });
        })
    );
  }

  function startNotificationsDown() {
    notificationProcessID++;

    const id = notificationProcessID;

    getNotifications(id);
  }

  startNotificationsDown();
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
        {#each notifications as notification, index (notification)}
          <a
            href="javascript:void(0);"
            class="dropdown-item d-flex flex-row border-bottom py-2"
            class:notification-unread={notification.status === 'NOT_READ'}>

            <div class="col-auto pl-0">
              <Icon data={faDotCircle} class="text-primary"/>
            </div>
            <div class="col">
              <span class="text-wrap text-dark">{notification.type_ID}</span>
              <small class="text-gray d-block">
                 {moment(notification.date).fromNow()}
              </small>
            </div>
          </a>
        {/each}

        {#if notifications.length === 0}
          <div
                  class="d-flex flex-column align-items-center justify-content-center">
            <Icon data={faBell} scale="3" class="text-glass m-3"/>
            <p class="text-gray">Bildirim yok.</p>
          </div>
        {/if}
      </div>
    </div>
  </div>

</div>
