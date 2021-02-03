import "bootstrap";

import { ApiUtil } from "./pano/js/api.util";

import App from "./App.svelte";

ApiUtil.init(process.env.API_URL);

const app = new App({
  target: document.body,
});

export default app;
