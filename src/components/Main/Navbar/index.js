'use strict';

Vue.component('Navbar', new Promise(function (resolve) {
    resolve({
      template: PANO.UI,
      methods: {
        onSideBarCollapseClick() {
          this.$store.dispatch("toggleSidebar")
        },

        md5(string) {
          return md5(string)
        },

        setLang(lang) {
          this.$store.dispatch('setLang', lang)
        },

        logout() {
          this.$store.state.logoutLoading = true;

          ApiUtil.post("/api/auth/logout", {})
            .then(() => {
              window.location.href = '/';
            })
            .catch(() => {
              window.location.href = '/';
            });
        }
      },
      computed: {
        langLoading() {
          return this.$store.state.langLoading
        },

        username() {
          return this.$store.state.user.username
        },

        email() {
          return this.$store.state.user.email
        }
      }
    });
  })
);