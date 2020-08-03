<script>
  import { isPageInitialized, showNetworkErrorOnCatch } from "../../Store";
  import PostEditor from "../../components/PostEditor.svelte";

  isPageInitialized.set(true);
</script>

Create post

<PostEditor/>