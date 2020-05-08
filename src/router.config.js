import {ChunkGenerator} from "svelte-spa-chunk";

import ChunkComponent from "./Chunk.svelte";

const Chunk = ChunkGenerator(ChunkComponent);

export default {
  "/": {
    component: Chunk(() => import("./pages/Dashboard.svelte")),
  },
  "/players": {
    component: Chunk(() => import("./pages/Players.svelte")),
    children: {
      "": {
        component: Chunk(() => import("./pages/Players/AllPlayers.svelte")),
      },
      "/player": {
        component: Chunk(() => import("./pages/Players/Player.svelte")),
      },
    },
  },
  "/addons": {
    component: Chunk(() => import("./pages/Addons.svelte")),
  },
  "/view": {
    component: Chunk(() => import("./pages/View.svelte")),
    children: {
      "": {
        component: Chunk(() => import("./pages/View/Themes.svelte")),
      },
      "/theme-options": {
        component: Chunk(() => import("./pages/View/ThemeOptions.svelte")),
      },
    },
  },
  "/admins": {
    component: Chunk(() => import("./pages/Admins.svelte")),
  },
  "/tools": {
    component: Chunk(() => import("./pages/Tools.svelte")),
  },
  "/settings": {
    component: Chunk(() => import("./pages/Settings.svelte")),
    children: {
      "": {
        component: Chunk(() => import("./pages/Settings/General.svelte")),
      },
      "/site-settings": {
        component: Chunk(() => import("./pages/Settings/SiteSettings.svelte")),
      },
      "/updates": {
        component: Chunk(() => import("./pages/Settings/Updates.svelte")),
      },
      "/about": {
        component: Chunk(() => import("./pages/Settings/About.svelte")),
      },
    },
  },
  "/posts": {
    component: Chunk(() => import("./pages/Posts.svelte")),
    children: {
      "": {
        component: Chunk(() => import("./pages/Posts/AllPosts.svelte")),
      },
      "/published": {
        component: Chunk(() => import("./pages/Tickets/AllTickets.svelte")),
      },
      "/draft": {
        component: Chunk(() => import("./pages/Tickets/AllTickets.svelte")),
        params: {
          pageType: "draft",
        },
      },
      "/trash": {
        component: Chunk(() => import("./pages/Tickets/AllTickets.svelte")),
        params: {
          pageType: "trash",
        },
      },
      "/published/:page": {
        component: Chunk(() => import("./pages/Tickets/AllTickets.svelte")),
      },
      "/draft/:page": {
        component: Chunk(() => import("./pages/Tickets/AllTickets.svelte")),
        params: {
          pageType: "draft",
        },
      },
      "/trash/:page": {
        component: Chunk(() => import("./pages/Tickets/AllTickets.svelte")),
        params: {
          pageType: "trash",
        },
      },
      "/categories": {
        component: Chunk(() => import("./pages/Posts/Categories.svelte")),
      },
      "/categories/:page": {
        component: Chunk(() => import("./pages/Posts/Categories.svelte")),
      },
    },
  },
  "/tickets": {
    component: Chunk(() => import("./pages/Tickets.svelte")),
    children: {
      "": {
        component: Chunk(() => import("./pages/Tickets/AllTickets.svelte")),
      },
      "/all": {
        component: Chunk(() => import("./pages/Tickets/AllTickets.svelte")),
      },
      "/waitingReply": {
        component: Chunk(() => import("./pages/Tickets/AllTickets.svelte")),
        params: {
          pageType: "waitingReply",
        },
      },
      "/closed": {
        component: Chunk(() => import("./pages/Tickets/AllTickets.svelte")),
        params: {
          pageType: "closed",
        },
      },
      "/all/:page": {
        component: Chunk(() => import("./pages/Tickets/AllTickets.svelte")),
      },
      "/waitingReply/:page": {
        component: Chunk(() => import("./pages/Tickets/AllTickets.svelte")),
        params: {
          pageType: "waitingReply",
        },
      },
      "/closed/:page": {
        component: Chunk(() => import("./pages/Tickets/AllTickets.svelte")),
        params: {
          pageType: "closed",
        },
      },
      "/categories": {
        component: Chunk(() => import("./pages/Tickets/Categories.svelte")),
      },
      "/categories/:page": {
        component: Chunk(() => import("./pages/Tickets/Categories.svelte")),
      },
    },
  },
  "/notifications": {
    component: Chunk(() => import("./pages/Notifications.svelte")),
  },
  "*": {
    component: Chunk(() => import("./pages/Error404.svelte")),
  },
};
