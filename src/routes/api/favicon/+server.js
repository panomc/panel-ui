import * as api from "$lib/api-server.util.js";

/** @type {import('@sveltejs/kit').RequestHandler} */
export async function GET({ url, fetch }) {
  let body = await api.GET({ path: url.pathname, parse: false });

  if (body.status === 404) {
    return fetch("/assets/img/minecraft-icon.png");
  }

  return body;
}
