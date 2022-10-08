import { load as loadPosts, PageTypes } from "$lib/pages/Posts.svelte";

/**
 * @type {import('@sveltejs/kit').PageLoad}
 */
export async function load(params) {
  return loadPosts(params, PageTypes.TRASH);
}
