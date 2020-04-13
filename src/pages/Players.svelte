<script>
  import {isPageInitialized} from "../Store"
  import {onMount} from "svelte"

  onMount(() => {
    isPageInitialized.set(true);
  })
</script>

<div class="content">Players page!</div>
