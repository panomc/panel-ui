import { handle, throwError } from "../../../../../pano-ui/js/api.proxy.js";

export * from "../../../../../pano-ui/js/api.proxy.js";

const postThumbnailSize = 5 * 1024 * 1024; // 5 MB

async function handleUpload(event) {
  const { request } = event;
  const data = await request.formData();

  const thumbnail = data.get("thumbnail");

  if (thumbnail && thumbnail.size > postThumbnailSize) {
    return throwError("POST_THUMBNAIL_EXCEEDS_SIZE");
  }

  return handle(event, data);
}

/** @type {import('@sveltejs/kit').RequestHandler} */
export async function PUT(event) {
  return handleUpload(event);
}

/** @type {import('@sveltejs/kit').RequestHandler} */
export async function POST(event) {
  return handleUpload(event);
}