import {
  COOKIE_PREFIX,
  CSRF_TOKEN_COOKIE_NAME,
  JWT_COOKIE_NAME,
} from "$lib/variables";
import cookie from "cookie";
import * as api from "$lib/api-server.util.js";

/** @type {import('@sveltejs/kit').RequestHandler} */
export async function POST({ request }) {
  await api.POST("auth/logout", await request.text());

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
