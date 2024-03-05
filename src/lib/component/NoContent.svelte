<div
  class="container text-center animate__animated animate__zoomIn"
  on:click="{onClick}">
  {#if dark}
    <i class="{icon} text-light text-opacity-25 m-3"></i>
    <p class="text-light">{text}</p>
  {:else}
    <i class="{icon} text-dark text-opacity-25 m-3"></i>
    <small class="text-gray d-block mb-3">{text}</small>
  {/if}

  <slot />
</div>

<script>
  import { createEventDispatcher } from "svelte";
  import { _ } from "svelte-i18n";

  export let dark = false;
  export let icon = "fa-solid fa-ghost fa-3x";
  export let text = $_("components.no-content.here-is-empty");

  const dispatch = createEventDispatcher();

  function onClick(e) {
    dispatch("click", e);
  }
</script>
