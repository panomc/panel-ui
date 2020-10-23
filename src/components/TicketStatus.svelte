<script>
  export let status = 1;
</script>

{#if status === 1}
  <span class="badge badge-secondary badge-pill">Yeni</span>
{:else if status === 2}
  <span class="badge badge-sunflower badge-pill"> Yanıtlandı </span>
{:else if status === 3}
  <span class="badge badge-bittersweet badge-pill"> Kapalı </span>
{/if}
