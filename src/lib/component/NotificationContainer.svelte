<div class="toast-container position-fixed bottom-0 end-0 p-3">
  {#each $notifications as notification, index (notification)}
    <div
      id="notificationToast{notification.id}"
      class="toast"
      role="alert"
      aria-live="assertive"
      aria-atomic="true"
      on:click="{() => onNotificationClick(notification)}">
      <div class="toast-header bg-primary text-white">
        <strong class="me-auto">Pano</strong>
        <small>{getTime(checkTime, parseInt(notification.date), "")}</small>
        <button
          type="button"
          class="btn-close btn-close-white"
          data-bs-dismiss="toast"></button>
      </div>
      <div class="toast-body">{notification.typeId}</div>
    </div>
  {/each}
</div>

<script context="module">
  import { tick } from "svelte";
  import { get, writable } from "svelte/store";

  const notifications = writable([]);

  Array.prototype.insert = function (index, item) {
    this.splice(index, 0, item);

    return this;
  };

  Array.prototype.remove = function (index) {
    this.splice(index, 1);

    return this;
  };

  function delay(time) {
    return new Promise((resolve) => setTimeout(resolve, time));
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

      notificationElement.addEventListener("hidden.bs.toast", () => {
        notifications.update((notifications) => {
          const foundNotification = notifications.find(
            (notification) => notification.id === id
          );

          notifications.remove(notifications.indexOf(foundNotification));

          return notifications;
        });
      });
    }
  }
</script>

<script>
  import { onDestroy, onMount } from "svelte";

  import {
    showNetworkErrorOnCatch,
    notificationsCount,
    quickNotifications,
  } from "$lib/Store";
  import ApiUtil from "$lib/api.util";
  import { formatDistanceToNow } from "date-fns";
  import { onNotificationClick } from "$lib/NotificationManager.js";

  let quickNotificationProcessID = 0;

  let checkTime = 0;
  let interval;

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
        path: "/api/panel/notifications/quick",
      })
        .then((body) => {
          if (body.error) {
            reject();

            return;
          }

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
