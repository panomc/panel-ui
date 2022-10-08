import { load as loadPlayers, PageTypes } from "$lib/pages/Players.svelte";

/**
 * @type {import('@sveltejs/kit').PageLoad}
 */
export async function load(params) {
  return loadPlayers(params, PageTypes.BANNED);
}
