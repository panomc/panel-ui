import cookie from "cookie";
import * as api from "$lib/api.util.server";
import {
  COOKIE_PREFIX,
  JWT_COOKIE_NAME,
  CSRF_TOKEN_COOKIE_NAME,
} from "$lib/variables";

async function fetchBasicData(token) {
  return api.GET("/api/panel/basicData", token);
}

/** @type {import('@sveltejs/kit').Handle} */
export async function handle({ event, resolve }) {
  const locals = {};
  const { request } = event;
  const { url } = request;

  const cookies = cookie.parse(request.headers.get("cookie") || "");

  const jwt = cookies[COOKIE_PREFIX + JWT_COOKIE_NAME];
  const CSRFToken = cookies[COOKIE_PREFIX + CSRF_TOKEN_COOKIE_NAME];

  locals.basicData =
    !url.startsWith("/api/") &&
    !url.startsWith("/auth/") &&
    (await fetchBasicData(jwt));

  locals.jwt = jwt;
  locals.CSRFToken = CSRFToken;

  event.locals = locals;

  return resolve(event);
}

/** @type {import('@sveltejs/kit').GetSession} */
export async function getSession({ locals }) {
  const { basicData, CSRFToken } = locals;

  return {
    basicData,
    CSRFToken,
  };
}
