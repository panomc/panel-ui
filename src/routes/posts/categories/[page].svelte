<PostCategories data="{data}" />

<script context="module">
  import { load as loadPostCategories } from "../../_PostCategories.svelte";

  /**
   * @type {import('@sveltejs/kit').Load}
   */
  export async function load(params) {
    let output = {};

    const data = await loadPostCategories(params);

    output = {
      ...output,
      ...data,
    };

    return !!data ? output : null;
  }
</script>

<script>
  import PostCategories from "../../_PostCategories.svelte";

  export let data;
</script>
