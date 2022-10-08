import * as api from "$lib/api-server.util";

/** @type {import('@sveltejs/kit').RequestHandler} */
export async function GET({ url, locals: { jwt } }) {
  const body = await api.GET(url.pathname + url.search, jwt);

  return new Response(JSON.stringify(body));
}
