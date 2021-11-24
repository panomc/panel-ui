<PostEditor data="{data}" />

<script context="module">
  import { load as loadPostEditor, Modes } from "../_PostEditor.svelte";

  /**
   * @type {import('@sveltejs/kit').Load}
   */
  export async function load(params) {
    let output = {};

    const data = await loadPostEditor(params, Modes.CREATE);

    output = {
      ...output,
      ...data,
    };

    return !!data ? output : null;
  }
</script>

<script>
  import PostEditor from "../_PostEditor.svelte";

  export let data;
</script>
