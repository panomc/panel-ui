<script>
  import Icon from "svelte-awesome";
  import moment from "moment";
  import { onDestroy, onMount } from "svelte";
  import jQuery from "jquery";

  import { faBell, faDotCircle } from "@fortawesome/free-regular-svg-icons";

  import { isPageInitialized, showNetworkErrorOnCatch } from "../Store";
  import ApiUtil from "../pano/js/api.util";
  import tooltip from "../pano/js/tooltip.util";

  import ConfirmRemoveAllNotificationsModal from "../components/modals/ConfirmRemoveAllNotificationsModal.svelte";

  let notificationProcessID = 0;
  let notifications = [];
  let page = 0;
  let count = 0;
  let loadMoreLoading = false;

  let checkTime = 0;
  let interval;

  Array.prototype.insert = function (index, item) {
    this.splice(index, 0, item);

    return this;
  };

  Array.prototype.remove = function (index) {
    this.splice(index, 1);

    return this;
  };

  function setNotifications(newNotifications) {
    if (notifications.length === 0 || newNotifications.length === 0)
      notifications = newNotifications;
    else {
      const listOfFilterIsNotificationExists = [];

      newNotifications.forEach((item, index) => {
        listOfFilterIsNotificationExists[index] = notifications.filter(
          (filterItem) => filterItem.id === item.id
        );
      });

      newNotifications.forEach((item, index) => {
        if (listOfFilterIsNotificationExists[index].length === 0) {
          notifications = notifications.insert(index, item);
        }
      });
    }
  }

  function getNotifications(id) {
    showNetworkErrorOnCatch((resolve, reject) => {
      ApiUtil.get("panel/notifications")
        .then((response) => {
          if (notificationProcessID === id) {
            if (response.data.result === "ok") {
              setNotifications(response.data.notifications);

              count = parseInt(response.data.notifications_count);

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
    });
  }

  function loadMore() {
    loadMoreLoading = true;

    showNetworkErrorOnCatch((resolve, reject) => {
      ApiUtil.post("panel/notifications/loadMore", {
        id: notifications[notifications.length - 1].id,
      })
        .then((response) => {
          if (response.data.result === "ok") {
            response.data.notifications.forEach((notification) => {
              notifications.insert(notifications.length, notification);
            });

            // noinspection SillyAssignmentJS
            notifications = notifications;

            loadMoreLoading = false;

            resolve();
          } else reject();
        })
        .catch(() => {
          reject();
        });
    });
  }

  function deleteNotification(id) {
    jQuery('[data-toggle="tooltip"], .tooltip').tooltip("hide");

    showNetworkErrorOnCatch((resolve, reject) => {
      ApiUtil.post("panel/notifications/delete", {
        id
      })
        .then((response) => {
          if (response.data.result === "ok") {
            notifications.forEach((notification) => {
              if (notification.id === id) {
                notifications.remove(notifications.indexOf(notification));

                count--;
              }
            });

            // noinspection SillyAssignmentJS
            notifications = notifications;

            resolve();
          } else reject();
        })
        .catch(() => {
          reject();
        });
    });
  }

  function startNotificationsDown() {
    notificationProcessID++;

    const id = notificationProcessID;

    getNotifications(id);
  }

  startNotificationsDown();

  onMount(() => {
    interval = setInterval(() => {
      checkTime += 1;
    }, 1000);
  });

  onDestroy(() => {
    notificationProcessID++;

    clearInterval(interval);
  });

  function getTime(check, time, locale) {
    return moment(time).fromNow();
  }
</script>

<div class="container">
  <!-- Action Menu -->
  <div class="row mb-3">
    <div class="col-6"></div>
    {#if notifications.length !== 0}
      <div class="col text-right">
        <button
          type="button"
          class="btn btn-link text-danger"
          data-target="#ConfirmRemoveAllNotificationsModal"
          data-toggle="modal">
          <span class="d-md-inline d-none">Tümünü Sil</span>
        </button>
      </div>
    {/if}
  </div>

  <!-- All Notifications -->

  <div class="card">
    <div class="card-body">
      <div
        class="d-flex flex-column justify-content-center align-items-center
        border rounded">
        {#each notifications as notification, index (notification)}
          <div class="d-flex flex-row align-items-center w-100 border-bottom">
            <a
              href="javascript:void(0);"
              class="dropdown-item d-flex flex-row py-2"
              class:notification-unread="{notification.status === 'NOT_READ'}">
              <div class="col-auto pl-0">
                <Icon data="{faDotCircle}" class="text-primary" />
              </div>
              <div class="col">
                <span class="text-wrap text-dark">{notification.id} - {notification.type_ID}</span>
                <small class="text-gray d-block">
                  {getTime(checkTime, parseInt(notification.date), "")}
                </small>
              </div>
            </a>
            <button
              class="btn btn-link text-danger mx-2"
              use:tooltip="{['right', 'Bildirimi Sil']}"
              on:click="{deleteNotification(notification.id)}">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
        {/each}

        {#if notifications.length === 0}
          <div
            class="d-flex flex-column align-items-center justify-content-center">
            <Icon data="{faBell}" scale="3" class="text-glass m-3" />
            <p class="text-gray">Bildirim yok.</p>
          </div>
        {/if}

        {#if notifications.length < count && count > 10 + 10 * page}
          <div class="form-group mt-4">
            <button
              class="btn text-primary bg-lightprimary d-block m-auto"
              class:disabled="{loadMoreLoading}"
              on:click="{loadMore}"
              >Daha Fazla Göster ({count - notifications.length})
            </button>
          </div>
        {/if}
      </div>
    </div>
  </div>
</div>

<ConfirmRemoveAllNotificationsModal />
