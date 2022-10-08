import { load as loadTickets, PageTypes } from "$lib/pages/Tickets.svelte";

/**
 * @type {import('@sveltejs/kit').PageLoad}
 */
export async function load(params) {
  return loadTickets(params, PageTypes.WAITING_REPLY);
}
