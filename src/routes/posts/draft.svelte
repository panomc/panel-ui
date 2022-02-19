<Posts data="{data}" />

<script context="module">
  import { load as loadPosts, PageTypes } from "$lib/component/pages/Posts.svelte";

  /**
   * @type {import('@sveltejs/kit').Load}
   */
  export async function load(params) {
    let output = {};

    const data = await loadPosts(params, PageTypes.DRAFT);

    output = {
      ...output,
      ...data,
    };

    return !!data ? output : null;
  }
</script>

<script>
  import Posts from "$lib/component/pages/Posts.svelte";

  export let data;
</script>
