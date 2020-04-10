import {writable} from "svelte/store";

export const isPageChanged = writable(true);
export const isPageLoading = writable(true);
