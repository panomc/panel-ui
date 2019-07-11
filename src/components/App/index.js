function loadComponent(componentName, path) {
  return new Promise(function (resolve, reject) {
    requirejs([path], function () {
      const component = Vue.component(componentName);

      if (component) {
        resolve(component);
      } else {
        reject();
      }
    });
  });
}

function LoadCSS(cssURL) {

  // 'cssURL' is the stylesheet's URL, i.e. /css/styles.css

  return new Promise(function (resolve, reject) {

    const link = document.createElement('link');

    link.rel = 'stylesheet';

    link.href = cssURL;

    document.head.appendChild(link);

    link.onload = function () {
      resolve();
    };
  });
}

const span = document.createElement('span');

function extractContent(s) {
  span.innerHTML = s;
  return span.textContent || span.innerText;
};

ApiUtil.init();

Vue.use(Toasted);

const app = new Vue({
  el: '#app',
  template: PANO.UI,
  router,
  i18n,
  store,
  data: {
    splashLoading: true,
    waitAnimation: true
  },
  components: {
    Main: function (resolve, reject) {
      loadComponent('Main', '/panel/src/components/Main').then(resolve, reject);
    }
  },
  metaInfo() {
    return {
      title: this.$t("Common.Page.title"),
      meta: [
        {name: 'description', content: this.$t("Common.Page.description")}
      ]
    }
  },
  methods: {
    setLang(lang) {
      this.$store.dispatch('setLang', lang)
    },

    getBasicUserData() {
      this.$store.dispatch('getBasicUserData')
        .then(() => {
          this.splashLoading = false
          // this.$store.state.toastStatus = "SUCCESSFULLY_LOGIN"
          //
          // this.resetFormButtonStatus()
        })
        .catch(() => {
          // this.$refs.recaptcha.reset();
          //
          // this.resetFormButtonStatus()
          //
          // if (typeof error != "undefined")
          //     this.showLoginError(error)
        })
    }
  },
  computed: {
    langLoading() {
      return this.$store.state.langLoading
    },

    routePageLoading() {
      return this.$store.state.routePageLoading
    },

    splashLoadedForRoutePageLoading() {
      return this.$store.state.splashLoadedForRoutePageLoading
    },

    initialPageDataLoading() {
      return this.$store.state.initialPageDataLoading
    },

    splashLoadedForPageDataInitializationLoading() {
      return this.$store.state.splashLoadedForPageDataInitializationLoading
    },

    splashLoadedForLanguage() {
      return this.$store.state.splashLoadedForLanguage
    },

    logoutLoading() {
      return this.$store.state.logoutLoading
    },

    showSplash() {
      return this.waitAnimation || (this.splashLoading || (this.routePageLoading && !this.splashLoadedForRoutePageLoading) || (this.initialPageDataLoading && !this.splashLoadedForPageDataInitializationLoading) || (this.langLoading && !this.splashLoadedForLanguage)) || this.logoutLoading
    }
  },
  beforeMount() {
    let loadLanguage;

    if (LanguageUtil.isThereLanguage())
      loadLanguage = LanguageUtil.getLanguage();
    else if (navigator.language.toUpperCase() === "tr".toUpperCase() || navigator.language.toUpperCase() === "tr-tr".toUpperCase())
      loadLanguage = "tr";
    else
      loadLanguage = "en";

    loadLanguageAsync(loadLanguage);

    this.getBasicUserData();
  },
  mounted() {
    const vue = this;

    setTimeout(function () {
      vue.waitAnimation = false;
    }, 1500);
  }
});