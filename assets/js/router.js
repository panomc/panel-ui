const router = new VueRouter({
  mode: 'history',
  routes: [
    {
      path: '*',
      name: 'Error404',
      component: function (resolve, reject) {
        loadComponent('Error404', '/panel/src/pages/Error404').then(resolve, reject);
      }
    },
    {
      path: '/panel',
      name: 'Dashboard',
      component: function (resolve, reject) {
        loadComponent('Dashboard', '/panel/src/pages/Dashboard').then(resolve, reject);
      }
    },
    {
      path: '/panel/players',
      name: 'Players',
      component: function (resolve, reject) {
        loadComponent('Players', '/panel/src/pages/Players').then(resolve, reject);
      },
      children: [
        {
          path: "",
          component: function (resolve, reject) {
            loadComponent('AllPlayers', '/panel/src/pages/Players/AllPlayers').then(resolve, reject);
          }
        },
        {
          path: ":player",
          component: function (resolve, reject) {
            loadComponent('Player', '/panel/src/pages/Players/Player').then(resolve, reject);
          }
        }
      ]
    },
    {
      path: '/panel/addons',
      name: 'Addons',
      component: function (resolve, reject) {
        loadComponent('Addons', '/panel/src/pages/Addons').then(resolve, reject);
      }
    },
    {
      path: '/panel/view',
      name: 'SiteView',
      component: function (resolve, reject) {
        loadComponent('SiteView', '/panel/src/pages/View').then(resolve, reject);
      },
      children: [
        {
          path: "",
          component: function (resolve, reject) {
            loadComponent('Themes', '/panel/src/pages/View/Themes').then(resolve, reject);
          }
        },
        {
          path: "theme-options",
          component: function (resolve, reject) {
            loadComponent('ThemeOptions', '/panel/src/pages/View/ThemeOptions').then(resolve, reject);
          }
        }
      ]
    },
    {
      path: '/panel/settings',
      name: 'Settings',
      component: function (resolve, reject) {
        loadComponent('Settings', '/panel/src/pages/Settings').then(resolve, reject);
      },
      children: [
        {
          path: "",
          component: function (resolve, reject) {
            loadComponent('General', '/panel/src/pages/Settings/General').then(resolve, reject);
          }
        },
        {
          path: "site-settings",
          component: function (resolve, reject) {
            loadComponent('SiteSettings', '/panel/src/pages/Settings/SiteSettings').then(resolve, reject);
          }
        },
        {
          path: "updates",
          component: function (resolve, reject) {
            loadComponent('Updates', '/panel/src/pages/Settings/Updates').then(resolve, reject);
          }
        },
        {
          path: "about",
          component: function (resolve, reject) {
            loadComponent('About', '/panel/src/pages/Settings/About').then(resolve, reject);
          }
        }
      ]
    },
    {
      path: '/panel/admins',
      name: 'Admins',
      component: function (resolve, reject) {
        loadComponent('Admins', '/panel/src/pages/Admins').then(resolve, reject);
      }
    },
    {
      path: '/panel/tools',
      name: 'Tools',
      component: function (resolve, reject) {
        loadComponent('Tools', '/panel/src/pages/Tools').then(resolve, reject);
      }
    },
    {
      path: '/panel/notifications',
      name: 'Notifications',
      component: function (resolve, reject) {
        loadComponent('Notifications', '/panel/src/pages/Notifications').then(resolve, reject);
      }
    }
  ]
});


router.beforeEach((to, from, next) => {
  store.state.routePageLoading = true;

  next()

  // const check = function () {
  // };

  // check()
});

router.afterEach((to, from) => {
  store.state.routePageLoading = false;

  store.state.splashLoadedForRoutePageLoading = true;
});