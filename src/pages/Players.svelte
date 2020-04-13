<script>
  import {isPageInitialized} from "../Store"
  import {onMount} from "svelte"

  onMount(() => {
    isPageInitialized.set(false);
  })
</script>

<div class="content">Players page!</div>
