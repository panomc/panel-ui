import * as api from "$lib/api.util.server";

/** @type {import('@sveltejs/kit').RequestHandler} */
export async function get({ locals: { jwt } }) {
  const response = await api.get("/testNotification", jwt);

  return {
    body: response,
  };
}
