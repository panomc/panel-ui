<Posts data="{data}" />

<script context="module">
  import { load as loadPosts, PageTypes } from "$lib/pages/Posts.svelte";

  /**
   * @type {import('@sveltejs/kit').Load}
   */
  export async function load(params) {
    let output = {};

    const data = await loadPosts(params, PageTypes.TRASH);

    output = {
      ...output,
      ...data,
    };

    return !!data ? output : null;
  }
</script>

<script>
  import Posts from "$lib/pages/Posts.svelte";

  export let data;
</script>
