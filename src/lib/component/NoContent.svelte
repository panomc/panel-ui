<div class="container text-center animate__animated animate__zoomIn">
  {#if dark}
    <i class="{icon} text-light text-opacity-25 m-3"></i>
    <p class="text-light">{text}</p>
  {:else}
    <i class="{icon} text-dark text-opacity-25 m-3"></i>
    <p class="text-gray">{text}</p>
  {/if}

  <slot></slot>
</div>

<script>
  export let dark = false;
  export let icon = "fa-solid fa-ghost fa-3x";
  export let text = "Burada içerik yok.";
</script>
