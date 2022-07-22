<div class="toast-container position-fixed bottom-0 end-0 p-3">
  {#each $notifications as notification, index (notification)}
    <div
      id="notificationToast{notification.id}"
      class="toast"
      role="alert"
      aria-live="assertive"
      aria-atomic="true">
      <div class="toast-header">
        <img src="..." class="rounded me-2" alt="..." />
        <strong class="me-auto">Bootstrap</strong>
        <small>{getTime(checkTime, parseInt(notification.date), "")}</small>
        <button
          type="button"
          class="btn-close"
          data-bs-dismiss="toast"
          aria-label="Close"></button>
      </div>
      <div class="toast-body">{notification.typeId}</div>
    </div>
  {/each}
</div>

<script context="module">
  import { tick } from "svelte";
  import { get, writable } from "svelte/store";

  const notifications = writable([]);

  function delay(time) {
    return new Promise(resolve => setTimeout(resolve, time));
  }

  export async function show(id) {
    while (!window.bootstrap) {
      await delay(50);
    }

    await tick();

    const notificationElement = document.getElementById(
      "notificationToast" + id
    );

    if (notificationElement) {
      const toast = new window.bootstrap.Toast(notificationElement);

      toast.show();
    }
  }
</script>

<script>
  import { onDestroy, onMount } from "svelte";

  import { session } from "$app/stores";

  import {
    showNetworkErrorOnCatch,
    notificationsCount,
    quickNotifications,
  } from "$lib/store";
  import ApiUtil from "$lib/api.util";
  import { formatDistanceToNow } from "date-fns";

  let quickNotificationProcessID = 0;

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

  function getTime(check, time, locale) {
    return formatDistanceToNow(time, { addSuffix: true });
  }

  function addNotification(notification) {
    notifications.update((notifications) => {
      notifications.push(notification);

      return notifications;
    });

    show(notification.id);
  }

  function setNotifications(newNotifications) {
    if (get(quickNotifications).length === 0 || newNotifications.length === 0) {
      quickNotifications.set(newNotifications);

      newNotifications.forEach((notification) => {
        if (notification.status === "NOT_READ") {
          addNotification(notification);
        }
      });

      return;
    }

    const listOfFilterIsNotificationExists = [];

    newNotifications.forEach((item, index) => {
      listOfFilterIsNotificationExists[index] = get(quickNotifications).filter(
        (filterItem) => filterItem.id === item.id
      );
    });

    newNotifications.forEach((item, index) => {
      if (listOfFilterIsNotificationExists[index].length === 0) {
        quickNotifications.update((quickNotifications) => {
          return quickNotifications.insert(index, item);
        });

        addNotification(item);
      }
    });

    get(quickNotifications).forEach((item, index) => {
      const newArrayOfFilter = newNotifications.filter(
        (filterItem) => filterItem.id === item.id
      );

      if (newArrayOfFilter.length === 0) {
        quickNotifications.update((quickNotifications) => {
          return quickNotifications.remove(index);
        });
      }
    });
  }

  function getQuickNotifications(id) {
    showNetworkErrorOnCatch((resolve, reject) => {
      ApiUtil.get({
        path: "/api/panel/quickNotifications",
        CSRFToken: $session.CSRFToken,
      })
        .then((body) => {
          if (quickNotificationProcessID === id) {
            if (body.result === "ok") {
              setNotifications(body.notifications);

              notificationsCount.set(body.notificationCount);
            }

            setTimeout(() => {
              if (quickNotificationProcessID === id) {
                startQuickNotificationsCountDown();
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

  function startQuickNotificationsCountDown() {
    quickNotificationProcessID++;

    const id = quickNotificationProcessID;

    getQuickNotifications(id);
  }

  onMount(() => {
    startQuickNotificationsCountDown();

    interval = setInterval(() => {
      checkTime += 1;
    }, 1000);
  });

  onDestroy(() => {
    clearInterval(interval);
  });
</script>
