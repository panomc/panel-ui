const LANGUAGE = 'language';
const SIDEBAR_STORAGE_STATUS = 'sidebar_storage_status';


const LanguageUtil = {
  getLanguage() {
    return localStorage.getItem(LANGUAGE)
  },

  saveLanguage(language) {
    localStorage.setItem(LANGUAGE, language)
  },

  isThereLanguage() {
    return !!LanguageUtil.getLanguage()
  }
};

const PanelSidebarStorageUtil = {
  getSidebarOpenStatus() {
    return localStorage.getItem(SIDEBAR_STORAGE_STATUS) === "true"
  },

  savePanelSidebarStorageUtil(status) {
    localStorage.setItem(SIDEBAR_STORAGE_STATUS, status)
  },

  isThereSideBarOpenStatus() {
    return !!localStorage.getItem(SIDEBAR_STORAGE_STATUS)
  }
};