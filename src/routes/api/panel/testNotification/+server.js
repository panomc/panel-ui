import * as api from "$lib/api-server.util.js";

/** @type {import('@sveltejs/kit').RequestHandler} */
export async function GET({ url, locals: { jwt } }) {
  const body = await api.GET({ path: url.pathname + url.search, token: jwt });

  return new Response(JSON.stringify(body));
}
