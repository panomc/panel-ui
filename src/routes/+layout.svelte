<MainLayout data="{data}">
  <slot />
</MainLayout>

<script>
  import MainLayout from "$lib/layouts/MainLayout.svelte";

  export let data;
</script>
