export default {
  basePath: "/panel",
  routes: {
    "/": {
      component: () => import("./pages/Dashboard.svelte"),
    },
    "/players": {
      component: () => import("./pages/Players.svelte"),
      children: {
        "": {
          component: () => import("./pages/Players/AllPlayers.svelte"),
        },
        "/player": {
          component: () => import("./pages/Players/Player.svelte"),
        },
      },
    },
    "/addons": {
      component: () => import("./pages/Addons.svelte"),
    },
    "/view": {
      component: () => import("./pages/View.svelte"),
      children: {
        "": {
          component: () => import("./pages/View/Themes.svelte"),
        },
        "/theme-options": {
          component: () => import("./pages/View/ThemeOptions.svelte"),
        },
      },
    },
    "/admins": {
      component: () => import("./pages/Admins.svelte"),
    },
    "/tools": {
      component: () => import("./pages/Tools.svelte"),
    },
    "/settings": {
      component: () => import("./pages/Settings.svelte"),
      children: {
        "": {
          component: () => import("./pages/Settings/General.svelte"),
        },
        "/site-settings": {
          component: () => import("./pages/Settings/SiteSettings.svelte"),
        },
        "/updates": {
          component: () => import("./pages/Settings/Updates.svelte"),
        },
        "/about": {
          component: () => import("./pages/Settings/About.svelte"),
        },
      },
    },
    "/posts": {
      component: () => import("./pages/Posts.svelte"),
      children: {
        "": {
          component: () => import("./pages/Posts/AllPosts.svelte"),
        },
        "/create-post": {
          component: () => import("./pages/Posts/CreatePost.svelte")
        },
        "/post/:postID": {
          component: () => import("./pages/Posts/EditPost.svelte")
        },
        "/published": {
          component: () => import("./pages/Posts/AllPosts.svelte"),
        },
        "/draft": {
          component: () => import("./pages/Posts/AllPosts.svelte"),
          params: {
            pageType: "draft",
          },
        },
        "/trash": {
          component: () => import("./pages/Posts/AllPosts.svelte"),
          params: {
            pageType: "trash",
          },
        },
        "/published/:page": {
          component: () => import("./pages/Posts/AllPosts.svelte"),
        },
        "/draft/:page": {
          component: () => import("./pages/Posts/AllPosts.svelte"),
          params: {
            pageType: "draft",
          },
        },
        "/trash/:page": {
          component: () => import("./pages/Posts/AllPosts.svelte"),
          params: {
            pageType: "trash",
          },
        },
        "/categories": {
          component: () => import("./pages/Posts/Categories.svelte"),
        },
        "/categories/:page": {
          component: () => import("./pages/Posts/Categories.svelte"),
        },
      },
    },
    "/tickets": {
      component: () => import("./pages/Tickets.svelte"),
      children: {
        "": {
          component: () => import("./pages/Tickets/AllTickets.svelte"),
        },
        "/all": {
          component: () => import("./pages/Tickets/AllTickets.svelte"),
        },
        "/waitingReply": {
          component: () => import("./pages/Tickets/AllTickets.svelte"),
          params: {
            pageType: "waitingReply",
          },
        },
        "/closed": {
          component: () => import("./pages/Tickets/AllTickets.svelte"),
          params: {
            pageType: "closed",
          },
        },
        "/all/:page": {
          component: () => import("./pages/Tickets/AllTickets.svelte"),
        },
        "/waitingReply/:page": {
          component: () => import("./pages/Tickets/AllTickets.svelte"),
          params: {
            pageType: "waitingReply",
          },
        },
        "/closed/:page": {
          component: () => import("./pages/Tickets/AllTickets.svelte"),
          params: {
            pageType: "closed",
          },
        },
        "/categories": {
          component: () => import("./pages/Tickets/Categories.svelte"),
        },
        "/categories/:page": {
          component: () => import("./pages/Tickets/Categories.svelte"),
        },
        "/ticket/:id": {
          component: () => import("./pages/Tickets/TicketDetail.svelte")
        }
      }
    },
    "/notifications": {
      component: () => import("./pages/Notifications.svelte"),
    },
    "*": {
      component: () => import("./pages/Error404.svelte"),
    },
  },
};
