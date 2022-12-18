import { get, writable } from "svelte/store";

import { invalidateAll } from "$app/navigation";

import { PanelSidebarStorageUtil } from "$lib/storage.util";

export const session = writable({});

export const options = Object.freeze({
  DEFAULT_PAGE_TITLE: "Pano",
});

export const networkErrorCallbacks = writable([]);
export const retryingNetworkErrors = writable(false);

export const isSidebarOpen = writable(
  PanelSidebarStorageUtil.isThereSideBarOpenStatus()
    ? PanelSidebarStorageUtil.getSidebarOpenStatus()
    : true
);
export const sidebarTabsState = writable(
  PanelSidebarStorageUtil.isThereSideBarTabsState()
    ? PanelSidebarStorageUtil.getSidebarTabsState()
    : "website"
);

export const user = writable({});
export const website = writable({});

export const currentServerPlatformMatchKey = writable("");
export const platformKeyRefreshedTime = writable(new Date().getTime());
export const platformAddress = writable("");

export const notificationsCount = writable(0);
export const quickNotifications = writable([]);

export const logoutLoading = writable(false);

export const notLoggedIn = writable(false);

export const pageTitle = writable(null);

export const websiteLogoSrc = writable("/api/websiteLogo");

export function setDefaults() {
  networkErrorCallbacks.set([]);
  retryingNetworkErrors.set(false);
  notLoggedIn.set(false);
  logoutLoading.set(false);
  pageTitle.set(null);
}

export function toggleSidebar() {
  isSidebarOpen.update((value) => {
    PanelSidebarStorageUtil.savePanelSidebarStorageUtil(!value);

    return !value;
  });
}

export function setSidebarTabsState(state) {
  sidebarTabsState.set(state);

  PanelSidebarStorageUtil.setSidebarTabsState(state);
}

export function showNetworkErrorOnCatch(callback, isErrorAlready = false) {
  if (isErrorAlready) {
    networkErrorCallbacks.update((value) => value.concat(callback));

    return;
  }

  new Promise((resolve, reject) => {
    callback(resolve, reject);
  }).catch(() => {
    networkErrorCallbacks.update((value) => value.concat(callback));
  });
}

export async function resumeAfterNetworkError() {
  retryingNetworkErrors.set(true);

  const currentList = get(networkErrorCallbacks).concat();
  const calledList = [];

  function check() {
    let callbacksDone = true;

    currentList.forEach((item) => {
      if (calledList.indexOf(item) === -1) {
        callbacksDone = false;
      }
    });

    if (callbacksDone) {
      retryingNetworkErrors.set(false);
    }
  }

  currentList.forEach((callback) => {
    new Promise((resolve, reject) => {
      callback(resolve, reject);
    })
      .then(() => {
        calledList.push(callback);

        networkErrorCallbacks.update((list) =>
          list.filter((item) => item !== callback)
        );

        check();
      })
      .catch(() => {
        calledList.push(callback);

        check();
      });
  });

  await invalidateAll();
}

export function initializeBasicData(data) {
  notLoggedIn.set(false);

  user.set(data.user);
  website.set(data.website);
  currentServerPlatformMatchKey.set(data.platformServerMatchKey);
  platformKeyRefreshedTime.set(data.platformServerMatchKeyTimeStarted);
  platformAddress.set(data.platformHostAddress);
  notificationsCount.set(data.notificationCount);
}
