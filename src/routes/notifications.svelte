<div class="container">
  <!-- Action Menu -->
  <div class="row mb-3">
    <div class="col-6"></div>
    {#if $notifications.length !== 0}
      <div class="col text-right">
        <button
          type="button"
          class="btn btn-link text-danger"
          on:click="{() => onDeleteAllClick()}"
        >
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
        border rounded"
      >
        {#each $notifications as notification, index (notification)}
          <div class="d-flex flex-row align-items-center w-100 border-bottom">
            <a
              href="javascript:void(0);"
              class="dropdown-item d-flex flex-row py-2"
              class:notification-unread="{notification.status === 'NOT_READ'}"
            >
              <div class="col-auto pl-0">
                <i class="fas fa-dot-circle text-primary"></i>
              </div>
              <div class="col">
                <span class="text-wrap text-dark">{notification.type_ID}</span>
                <small class="text-gray d-block">
                  {getTime(checkTime, parseInt(notification.date), "")}
                </small>
              </div>
            </a>
            <button
              class="btn btn-link text-danger mx-2"
              use:tooltip="{['Bildirimi Sil', { placement: 'right' }]}"
              on:click="{deleteNotification(notification.id)}"
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
        {/each}

        {#if $notifications.length === 0}
          <div
            class="d-flex flex-column align-items-center justify-content-center"
          >
            <i class="fas fa-bell fa-3x text-glass m-3"></i>
            <p class="text-gray">Bildirim yok.</p>
          </div>
        {/if}

        {#if $notifications.length < $count && $count > 10 + 10 * page}
          <div class="form-group mt-4">
            <button
              class="btn text-primary bg-lightprimary d-block m-auto"
              class:disabled="{loadMoreLoading}"
              on:click="{loadMore}"
              >Daha Fazla Göster ({$count - $notifications.length})
            </button>
          </div>
        {/if}
      </div>
    </div>
  </div>
</div>

<ConfirmRemoveAllNotificationsModal />

<script context="module">
  import { writable, get } from "svelte/store";

  import { browser } from "$app/env";

  import { showNetworkErrorOnCatch } from "$lib/store";
  import ApiUtil from "$lib/api.util";

  let refreshable = false;

  const notifications = writable([]);
  const count = writable(0);

  Array.prototype.insert = function (index, item) {
    this.splice(index, 0, item);

    return this;
  };

  Array.prototype.remove = function (index) {
    this.splice(index, 1);

    return this;
  };

  function setNotifications(newNotifications) {
    if (get(notifications).length === 0 || newNotifications.length === 0)
      notifications.set(newNotifications);
    else {
      const listOfFilterIsNotificationExists = [];

      newNotifications.forEach((item, index) => {
        listOfFilterIsNotificationExists[index] = get(notifications).filter(
          (filterItem) => filterItem.id === item.id
        );
      });

      newNotifications.forEach((item, index) => {
        if (listOfFilterIsNotificationExists[index].length === 0) {
          notifications.set(get(notifications).insert(index, item));
        }
      });
    }
  }

  async function loadData() {
    return new Promise((resolvePromise, rejectPromise) => {
      showNetworkErrorOnCatch((resolve, reject) => {
        ApiUtil.get("panel/notifications")
          .then((response) => {
            if (response.data.result === "ok") {
              resolve();
              resolvePromise(response.data);
            } else {
              reject();

              rejectPromise(response.data);
            }
          })
          .catch((e) => {
            reject();
            console.log(e);
          });
      });
    });
  }

  /**
   * @type {import('@sveltejs/kit').Load}
   */
  export async function load({ page, session }) {
    let output = {
      props: {
        data: {
          notifications: [],
          notifications_count: 0,
        },
      },
    };

    if (browser && (page.path !== session.loadedPath || refreshable)) {
      // from another page
      await loadData().then((data) => {
        setNotifications(data.notifications);

        count.set(parseInt(data.notifications_count));
      });
    }

    if (page.path === session.loadedPath && !refreshable) {
      if (browser) refreshable = true;

      setNotifications(session.data.notifications);

      count.set(parseInt(session.data.notifications_count));
    }

    return output;
  }
</script>

<script>
  import { onDestroy, onMount } from "svelte";
  import { formatDistanceToNow } from "date-fns";

  import tooltip from "$lib/tooltip.util";

  import ConfirmRemoveAllNotificationsModal, {
    show as showDeleteAllNotificationsModal,
    setCallback as setDeleteAllNotificationsModalCallback,
  } from "../components/modals/ConfirmRemoveAllNotificationsModal.svelte";

  let notificationProcessID = 0;
  let page = 0;
  let loadMoreLoading = false;

  let checkTime = 0;
  let interval;

  function getNotifications(id) {
    loadData().then((data) => {
      if (notificationProcessID === id) {
        if (data.result === "ok") {
          setNotifications(data.notifications);

          count.set(parseInt(data.notifications_count));
        }

        setTimeout(() => {
          if (notificationProcessID === id) {
            startNotificationsCountdown();
          }
        }, 1000);
      }
    });
  }

  function loadMore() {
    loadMoreLoading = true;

    showNetworkErrorOnCatch((resolve, reject) => {
      ApiUtil.post("panel/notifications/loadMore", {
        id: get(notifications)[get(notifications).length - 1].id,
      })
        .then((response) => {
          if (response.data.result === "ok") {
            response.data.notifications.forEach((notification) => {
              notifications.update((value) =>
                value.insert(value.length, notification)
              );
            });

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
    showNetworkErrorOnCatch((resolve, reject) => {
      ApiUtil.post("panel/notifications/delete", {
        id,
      })
        .then((response) => {
          if (response.data.result === "ok") {
            get(notifications).forEach((notification) => {
              if (notification.id === id) {
                notifications.update((value) =>
                  value.remove(value.indexOf(notification))
                );

                count.update((value) => value--);
              }
            });

            resolve();
          } else reject();
        })
        .catch(() => {
          reject();
        });
    });
  }

  function startNotificationsCountdown() {
    notificationProcessID++;

    const id = notificationProcessID;

    getNotifications(id);
  }

  function stopNotificationsCountdown() {
    notificationProcessID++;

    clearInterval(interval);
  }

  function getTime(check, time, locale) {
    return formatDistanceToNow(time, { addSuffix: true });
  }

  function onDeleteAllClick() {
    stopNotificationsCountdown();

    showDeleteAllNotificationsModal();
  }

  if (browser) startNotificationsCountdown();

  onMount(() => {
    interval = setInterval(() => {
      checkTime += 1;
    }, 1000);
  });

  onDestroy(() => {
    stopNotificationsCountdown();
  });

  setDeleteAllNotificationsModalCallback(() => {
    startNotificationsCountdown();
  });
</script>
