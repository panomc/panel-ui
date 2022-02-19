<Posts data="{data}" />

<script context="module">
  import { load as loadPosts } from "$lib/component/pages/posts/CategoryPosts.svelte";

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
  import Posts from "$lib/component/pages/posts/CategoryPosts.svelte";

  export let data;
</script>
