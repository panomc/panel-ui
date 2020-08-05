
const span = document.createElement('span');

export function extractContent(s) {
  span.innerHTML = s;

  return span.textContent || span.innerText;
}