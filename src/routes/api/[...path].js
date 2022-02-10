import * as api from "$lib/api.util.server";
import { CSRF_HEADER } from "$lib/variables";

async function handle(request) {
  const { method, params, body, headers } = request;
  const { path } = params;
  const { jwt, CSRFToken } = request.locals;

  let response;

  if (path !== "testNotification" && headers[CSRF_HEADER] !== CSRFToken) {
    return null;
  }

  if (method === "GET") {
    response = await api.get(path, jwt);
  }

  if (method === "DELETE") {
    response = await api.del(path, jwt);
  }

  if (method === "POST") {
    response = await api.post(path, body, jwt);
  }

  if (method === "PUT") {
    response = await api.put(path, body, jwt);
  }

  return { body: response };
}

/** @type {import('@sveltejs/kit').RequestHandler} */
export async function get(request) {
  return await handle(request);
}

/** @type {import('@sveltejs/kit').RequestHandler} */
export async function del(request) {
  return await handle(request);
}

/** @type {import('@sveltejs/kit').RequestHandler} */
export async function post(request) {
  return await handle(request);
}

/** @type {import('@sveltejs/kit').RequestHandler} */
export async function put(request) {
  return await handle(request);
}
