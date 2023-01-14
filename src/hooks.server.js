import {
  COOKIE_PREFIX,
  JWT_COOKIE_NAME,
  CSRF_TOKEN_COOKIE_NAME,
} from "$lib/variables";

import ApiUtil, { networkErrorBody } from "$lib/api.util.js";

async function fetchBasicData(token, CSRFToken) {
  return ApiUtil
    .get({ path: "/api/panel/basicData", token, CSRFToken })
    .catch(() => networkErrorBody);
}

/** @type {import('@sveltejs/kit').Handle} */
export async function handle({
  event,
  event: {
    cookies
  },
  resolve,
}) {
  const locals = {};

  const jwt = cookies.get([COOKIE_PREFIX + JWT_COOKIE_NAME]);
  const CSRFToken = cookies.get([COOKIE_PREFIX + CSRF_TOKEN_COOKIE_NAME]);

  locals.basicData = await fetchBasicData(jwt, CSRFToken);

  locals.jwt = jwt;
  locals.CSRFToken = CSRFToken;

  event.locals = locals;

  return resolve(event);
}
