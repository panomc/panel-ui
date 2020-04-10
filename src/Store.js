import {writable} from "svelte/store";

import {PanelSidebarStorageUtil} from "./util/storage.util"

export const isSidebarOpen = writable(PanelSidebarStorageUtil.isThereSideBarOpenStatus() ? PanelSidebarStorageUtil.getSidebarOpenStatus() : true);

export function toggleSidebar() {
  isSidebarOpen.update(value => {
    PanelSidebarStorageUtil.savePanelSidebarStorageUtil(!value);

    return !value;
  });
}