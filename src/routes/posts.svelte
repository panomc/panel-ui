<Posts data="{data}" />

<script context="module">
  import { load as loadPosts } from "./_Posts.svelte";

  /**
   * @type {import('@sveltejs/kit').Load}
   */
  export async function load(params) {
    let output = {};

    const data = await loadPosts(params);

    output = {
      ...output,
      ...data,
    };

    return !!data ? output : null;
  }
</script>

<script>
  import Posts from "./_Posts.svelte";

  export let data;
</script>
