import {writable} from "svelte/store";

import {PanelSidebarStorageUtil} from "./util/storage.util"

export const isSidebarOpen = writable(PanelSidebarStorageUtil.isThereSideBarOpenStatus() ? PanelSidebarStorageUtil.getSidebarOpenStatus() : true);
export const sidebarTabsState = writable(PanelSidebarStorageUtil.isThereSideBarTabsState() ? PanelSidebarStorageUtil.getSidebarTabsState() : "website");
export const isPageInitialized = writable(false);
export const isPageGonnaInitialize = writable(false);

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
