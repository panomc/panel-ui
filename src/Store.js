import {writable} from "svelte/store";

import {PanelSidebarStorageUtil} from "./util/storage.util"
import {ApiUtil, NETWORK_ERROR} from "./util/api.util";

export const isSidebarOpen = writable(PanelSidebarStorageUtil.isThereSideBarOpenStatus() ? PanelSidebarStorageUtil.getSidebarOpenStatus() : true);
export const sidebarTabsState = writable(PanelSidebarStorageUtil.isThereSideBarTabsState() ? PanelSidebarStorageUtil.getSidebarTabsState() : "website");

export const isPageInitialized = writable(false);
export const isPageGonnaInitialize = writable(false);

export const user = writable({});
export const website = writable({});

export const currentServerPlatformMatchKey = writable("");
export const platformAddress = writable("");

export const servers = writable([]);
export const quickNotifications = writable([]);
export const notificationsCount = writable(0);


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

function initializeBasicData(data) {
  user.set(data.user);
  website.set(data.website);
  currentServerPlatformMatchKey.set(data.platform_server_match_key);
  platformAddress.set(data.platform_host_address);
  servers.set(data.servers);
  quickNotifications.set(data.quick_notifications);
  notificationsCount.set(data.notifications_count);
}