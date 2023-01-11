import { get, writable } from "svelte/store";

import { invalidateAll } from "$app/navigation";

import { PanelSidebarStorageUtil } from "$lib/storage.util";

export const options = Object.freeze({
  DEFAULT_PAGE_TITLE: "Pano",
});

export const networkErrorCallbacks = writable([]);
export const retryingNetworkErrors = writable(false);

export const quickNotifications = writable([]);

export const logoutLoading = writable(false);

export const websiteLogoSrc = writable("/api/websiteLogo");

export function toggleSidebar(isSidebarOpen) {
  isSidebarOpen.update((value) => {
    PanelSidebarStorageUtil.savePanelSidebarStorageUtil(!value);

    return !value;
  });
}

export function setSidebarTabsState(state, sidebarTabsState) {
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
