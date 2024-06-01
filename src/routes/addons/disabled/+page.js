import { load as loadAddons, PageTypes } from "$lib/pages/Addons.svelte";

/**
 * @type {import('@sveltejs/kit').PageLoad}
 */
export async function load(params) {
  return loadAddons(params, PageTypes.DISABLED);
}
