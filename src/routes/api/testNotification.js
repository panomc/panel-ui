import * as api from "$lib/api.util.server";

/** @type {import('@sveltejs/kit').RequestHandler} */
export async function get({ url, locals: { jwt } }) {
  const response = await api.get(url.pathname + url.search, jwt);

  return {
    body: response,
  };
}
