import { handle, throwError } from "../../../../../pano-ui/js/api.proxy.js";

export * from "../../../../../pano-ui/js/api.proxy.js";

const postThumbnailSize = 5 * 1024 * 1024; // 5 MB

/** @type {import('@sveltejs/kit').RequestHandler} */
export async function PUT(event) {
  const { request } = event;
  const data = await request.formData();

  const thumbnail = data.get("thumbnail");

  if (thumbnail && thumbnail.size > postThumbnailSize) {
    return throwError("POST_THUMBNAIL_EXCEEDS_SIZE");
  }

  return handle(event, data);
}