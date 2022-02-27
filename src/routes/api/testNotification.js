import * as api from "$lib/api.util.server";

/** @type {import('@sveltejs/kit').RequestHandler} */
export async function get({ request }) {
  const response = await api.get("/testNotification", await request.text());

  return {
    body: response,
  };
}
