import {ChunkGenerator} from "svelte-spa-chunk";

import ChunkComponent from "./Chunk.svelte";

const Chunk = ChunkGenerator(ChunkComponent);

export default {
  "/": {
    component: Chunk(() => import("./pages/Dashboard.svelte")),
  },
  "/players": {
    component: Chunk(() => import("./pages/Players.svelte")),
  },
  "/addons": {
    component: Chunk(() => import("./pages/Addons.svelte")),
  },
  "/view": {
    component: Chunk(() => import("./pages/View.svelte")),
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
        component: Chunk(()=> import("./pages/Settings/General.svelte"))
      },
    }
  },
  "/notifications": {
    component: Chunk(() => import("./pages/Notifications.svelte")),
  },
  "*": {
    component: Chunk(() => import("./pages/Error404.svelte")),
  },
};
