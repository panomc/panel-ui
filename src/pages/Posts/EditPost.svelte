<script>
  import PostEditor from "../../components/PostEditor.svelte";
  import { route } from "routve";

  export let postID = -1;

  if (postID === -1) {
    route("/panel/error-404");
  }
</script>

<PostEditor {postID} />
