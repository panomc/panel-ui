<div
  class="toast-container position-fixed bottom-0 start-50 translate-middle-x mb-3">
  {#each $toasts as toast, index (toast)}
    <div
      id="appToast{toast.id}"
      class="toast align-items-center text-bg-dark border-0"
      role="alert"
      aria-live="assertive"
      aria-atomic="true">
      <div class="d-flex">
        {#if toast.url}
          <a href="{base + toast.url}">
            <div class="toast-body">{toast.text}</div>
          </a>
        {:else}
          <div class="toast-body">{toast.text}</div>
        {/if}
        <button
          type="button"
          class="btn-close btn-close-white me-2 m-auto"
          data-bs-dismiss="toast"></button>
      </div>
    </div>
  {/each}
</div>

<script context="module">
  import { tick } from "svelte";
  import { writable } from "svelte/store";

  const toasts = writable([]);
  let id = 0;

  Array.prototype.insert = function (index, item) {
    this.splice(index, 0, item);

    return this;
  };

  Array.prototype.remove = function (index) {
    this.splice(index, 1);

    return this;
  };

  function delay(time) {
    return new Promise((resolve) => setTimeout(resolve, time));
  }

  export async function show(toast = { text: "", type: "SUCCESSFUL" }) {
    while (!window.bootstrap) {
      await delay(50);
    }

    id = id + 1;

    toast.id = id;

    toasts.update((toasts) => {
      toasts.push(toast);

      return toasts;
    });

    await tick();

    const toastElement = document.getElementById("appToast" + id);

    if (toastElement) {
      const toast = new window.bootstrap.Toast(toastElement);

      toast.show();

      toastElement.addEventListener("hidden.bs.toast", () => {
        toasts.update((toasts) => {
          const foundToast = toasts.find((toast) => toast.id === id);

          toasts.remove(toasts.indexOf(foundToast));

          return toasts;
        });
      });
    }
  }
</script>

<script>
  import { base } from "$app/paths";
</script>
