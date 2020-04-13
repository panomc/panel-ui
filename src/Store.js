import {get, writable} from "svelte/store";

import {PanelSidebarStorageUtil} from "./util/storage.util"
import {ApiUtil, NETWORK_ERROR} from "./util/api.util";


export const networkErrorCallbacks = writable([]);
export const retryingNetworkErrors = writable(false);

export const isSidebarOpen = writable(PanelSidebarStorageUtil.isThereSideBarOpenStatus() ? PanelSidebarStorageUtil.getSidebarOpenStatus() : true);
export const sidebarTabsState = writable(PanelSidebarStorageUtil.isThereSideBarTabsState() ? PanelSidebarStorageUtil.getSidebarTabsState() : "website");

export const isPageInitialized = writable(false);

export const user = writable({});
export const website = writable({});

export const currentServerPlatformMatchKey = writable("");
export const platformAddress = writable("");

export const servers = writable([]);
export const quickNotifications = writable([]);
export const notificationsCount = writable(0);

export const logoutLoading = writable(false);


export function toggleSidebar() {
  isSidebarOpen.update(value => {
    PanelSidebarStorageUtil.savePanelSidebarStorageUtil(!value);

    return !value;
  });
}

export function setSidebarTabsState(state) {
  sidebarTabsState.set(state);

  PanelSidebarStorageUtil.setSidebarTabsState(state);
}

export function getBasicData() {
  return new Promise((resolve, reject) => {
    ApiUtil.get("panel/basicData").then(response => {
      if (response.data.result === "ok") {
        initializeBasicData(response.data);

        resolve(response);
      } else if (response.data.result === "error") {
        const errorCode = response.data.error;

        reject(errorCode);
      } else {
        reject(NETWORK_ERROR);
      }
    }).catch(() => {
      reject(NETWORK_ERROR);
    });
  });
}

export function showNetworkErrorOnCatch(callback) {
  callback().catch(() => {
    networkErrorCallbacks.update(value => value.concat(callback));
  });
}

export function resumeAfterNetworkError() {
  retryingNetworkErrors.set(true);

  const currentList = get(networkErrorCallbacks).concat();
  const doneList = [];

  function check() {
    let callbacksDone = true;

    currentList.forEach(item => {
      if (doneList.indexOf(item) === -1) {
        callbacksDone = false;
      }
    });

    if (callbacksDone) {
      retryingNetworkErrors.set(false);
    }
  }

  currentList.forEach((callback) => {
    doneList.push(callback);

    callback()
      .then(() => {
        networkErrorCallbacks.update(list => list.filter(item => item !== callback));

        check();
      })
      .catch(() => {
        check();
      });
  })
}


function initializeBasicData(data) {
  user.set(data.user);
  website.set(data.website);
  currentServerPlatformMatchKey.set(data.platform_server_match_key);
  platformAddress.set(data.platform_host_address);
  servers.set(data.servers);
  quickNotifications.set(data.quick_notifications);
  notificationsCount.set(data.notifications_count);
}
