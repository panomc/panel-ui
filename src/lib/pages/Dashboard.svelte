<!-- Dashboard Page -->
<div class="container">
  Dashboard page
</div>

<script context="module">
  /**
   * @type {import('@sveltejs/kit').PageLoad}
   */
  export async function load(event) {
    const { parent } = event;
    const parentData = await parent();

    let data = {
    };

    if (parentData.NETWORK_ERROR) {
      return data;
    }

    return data;
  }
</script>

<script>
  export let data;
</script>
