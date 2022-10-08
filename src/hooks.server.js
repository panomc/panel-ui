import * as api from "$lib/api-server.util";
import {
  COOKIE_PREFIX,
  JWT_COOKIE_NAME,
  CSRF_TOKEN_COOKIE_NAME,
} from "$lib/variables";

async function fetchBasicData(token) {
  return api.GET("/api/panel/basicData", token);
}

/** @type {import('@sveltejs/kit').Handle} */
export async function handle({
  event,
  event: {
    cookies,
    url: { pathname },
  },
  resolve,
}) {
  const locals = {};

  const jwt = cookies.get([COOKIE_PREFIX + JWT_COOKIE_NAME]);
  const CSRFToken = cookies.get([COOKIE_PREFIX + CSRF_TOKEN_COOKIE_NAME]);

  locals.basicData =
    !pathname.startsWith("/api/") &&
    !pathname.startsWith("/auth/") &&
    (await fetchBasicData(jwt));

  locals.jwt = jwt;
  locals.CSRFToken = CSRFToken;

  event.locals = locals;

  return resolve(event);
}
