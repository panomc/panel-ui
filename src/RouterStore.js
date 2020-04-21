import {writable} from "svelte/store";

export const isPageLoading = writable(true);

export const path = writable("");
export const subRouterRoutesByBasePath = writable([]);
