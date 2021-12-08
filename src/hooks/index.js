import cookie from "cookie";
import * as api from "$lib/api.util.server";
import {
  COOKIE_PREFIX,
  JWT_COOKIE_NAME,
  CSRF_TOKEN_COOKIE_NAME,
} from "$lib/variables";

async function fetchBasicData(token) {
  return api.get("/panel/basicData", token);
}

/** @type {import('@sveltejs/kit').Handle} */
export async function handle({ request, resolve }) {
  const locals = {};
  const { path } = request;

  const cookies = cookie.parse(request.headers.cookie || "");

  const jwt = cookies[COOKIE_PREFIX + JWT_COOKIE_NAME];
  const CSRFToken = cookies[COOKIE_PREFIX + CSRF_TOKEN_COOKIE_NAME];

  locals.basicData =
    !path.startsWith("/api/") &&
    !path.startsWith("/auth/") &&
    (await fetchBasicData(jwt));

  locals.jwt = jwt;
  locals.CSRFToken = CSRFToken;

  request.locals = locals;

  return await resolve(request);
}

/** @type {import('@sveltejs/kit').GetSession} */
export async function getSession({ locals }) {
  const { basicData, CSRFToken } = locals;

  return {
    basicData,
    CSRFToken,
  };
}
