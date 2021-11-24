import { browser } from "$app/env";

let span;

if (browser) span = document.createElement("span");

export function extractContent(s) {
  if (!browser) return "";

  span.innerHTML = s;

  return span.textContent || span.innerText;
}
