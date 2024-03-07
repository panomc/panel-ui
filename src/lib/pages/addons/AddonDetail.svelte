<div class="container">
  Test addon detail page
</div>

<script>
  import { getContext } from "svelte";

  const pageTitle = getContext("pageTitle");

  pageTitle.set("Eklenti Detayı");
</script>
