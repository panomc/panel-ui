import {
  COOKIE_PREFIX,
  CSRF_TOKEN_COOKIE_NAME,
  JWT_COOKIE_NAME,
} from "$lib/variables";
import cookie from "cookie";

/** @type {import('@sveltejs/kit').RequestHandler} */
export async function POST() {
  const headers = new Headers();

  headers.append(
    "set-cookie",
    cookie.serialize(COOKIE_PREFIX + JWT_COOKIE_NAME, "deleted", {
      httpOnly: true,
      path: "/",
      expire: "Thu, 01 Jan 1970 00:00:00 GMT",
    })
  );

  headers.append(
    "set-cookie",
    cookie.serialize(COOKIE_PREFIX + CSRF_TOKEN_COOKIE_NAME, "deleted", {
      httpOnly: true,
      path: "/",
      expire: "Thu, 01 Jan 1970 00:00:00 GMT",
    })
  );

  return new Response(
    JSON.stringify({
      result: "ok",
    }),
    {
      headers,
    }
  );
}
