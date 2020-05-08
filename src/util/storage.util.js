const SIDEBAR_STORAGE_STATUS = "sidebar_storage_status";
const SIDEBAR_TABS_STORAGE_STATE = "sidebar_tabs_storage_state";

export const PanelSidebarStorageUtil = {
  getSidebarOpenStatus() {
    return localStorage.getItem(SIDEBAR_STORAGE_STATUS) === "true";
  },

  savePanelSidebarStorageUtil(status) {
    localStorage.setItem(SIDEBAR_STORAGE_STATUS, status);
  },

  isThereSideBarOpenStatus() {
    return !!localStorage.getItem(SIDEBAR_STORAGE_STATUS);
  },

  getSidebarTabsState() {
    return localStorage.getItem(SIDEBAR_TABS_STORAGE_STATE);
  },

  setSidebarTabsState(state) {
    localStorage.setItem(SIDEBAR_TABS_STORAGE_STATE, state);
  },

  isThereSideBarTabsState() {
    return !!localStorage.getItem(SIDEBAR_TABS_STORAGE_STATE);
  },
};
