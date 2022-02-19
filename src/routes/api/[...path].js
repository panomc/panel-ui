import * as api from "$lib/api.util.server";
import { CSRF_HEADER } from "$lib/variables";

/** @type {import('@sveltejs/kit').RequestHandler} */
async function handle({
  request: { method, headers },
  request,
  params: { path },
  locals: { jwt, CSRFToken },
}) {
  let response;

  if (path !== "testNotification" && headers.get(CSRF_HEADER) !== CSRFToken) {
    return null;
  }

  if (method === "GET") {
    response = await api.get(path, jwt);
  }

  if (method === "DELETE") {
    response = await api.del(path, jwt);
  }

  if (method === "POST") {
    response = await api.post(path, await request.text(), jwt);
  }

  if (method === "PUT") {
    response = await api.put(path, await request.text(), jwt);
  }

  return { body: response };
}

/** @type {import('@sveltejs/kit').RequestHandler} */
export async function get(event) {
  return await handle(event);
}

/** @type {import('@sveltejs/kit').RequestHandler} */
export async function del(event) {
  return await handle(event);
}

/** @type {import('@sveltejs/kit').RequestHandler} */
export async function post(event) {
  return await handle(event);
}

/** @type {import('@sveltejs/kit').RequestHandler} */
export async function put(event) {
  return await handle(event);
}
