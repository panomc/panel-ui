import { handle, throwError } from "../../../../pano-ui/js/api.proxy.js";

const faviconSize = 1024 * 1024; // 1 MB
const websiteLogoSize = 2 * 1024 * 1024; // 2 MB

/** @type {import('@sveltejs/kit').RequestHandler} */
export async function PUT(event) {
  const { request } = event;
  const data = await request.formData();

  const favicon = data.get("favicon");

  if (favicon && favicon.size > faviconSize) {
    return throwError("FAVICON_EXCEEDS_SIZE");
  }

  const websiteLogo = data.get("websiteLogo");

  if (websiteLogo && websiteLogo.size > websiteLogoSize) {
    return throwError("WEBSITE_LOGO_EXCEEDS_SIZE");
  }

  return handle(event, data);
}

/** @type {import('@sveltejs/kit').RequestHandler} */
export async function GET(event) {
  return handle(event);
}

/** @type {import('@sveltejs/kit').RequestHandler} */
export async function POST(event) {
  return handle(event);
}

/** @type {import('@sveltejs/kit').RequestHandler} */
export async function DELETE(event) {
  return handle(event);
}
