import {
  COOKIE_PREFIX,
  CSRF_TOKEN_COOKIE_NAME,
  JWT_COOKIE_NAME,
} from "$lib/variables";

/** @type {import('@sveltejs/kit').RequestHandler} */
export async function post() {
  return {
    headers: {
      "set-cookie": [
        `${
          COOKIE_PREFIX + JWT_COOKIE_NAME
        }=deleted; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`,
        `${
          COOKIE_PREFIX + CSRF_TOKEN_COOKIE_NAME
        }=deleted; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`,
      ],
    },
    body: {
      result: "ok",
    },
  };
}
