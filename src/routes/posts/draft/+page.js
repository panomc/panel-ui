import { load as loadPosts, PageTypes } from "$lib/pages/Posts.svelte";

/**
 * @type {import('@sveltejs/kit').PageLoad}
 */
export async function load(input) {
  return loadPosts(input, PageTypes.DRAFT);
}
