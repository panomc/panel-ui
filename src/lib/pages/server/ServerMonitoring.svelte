Monitoring page

<script context="module">
  // async function loadData({ request, selectedServer }) {
  //   return new Promise((resolve, reject) => {
  //     ApiUtil.get({
  //       path: `/api/panel/servers/${selectedServer.id}/dashboard`,
  //       request,
  //     }).then((body) => {
  //       if (body.result === "ok") {
  //         resolve(body);
  //       } else {
  //         reject(body);
  //       }
  //     });
  //   });
  // }

  /**
   * @type {import('@sveltejs/kit').PageLoad}
   */
  export async function load(event) {
    const { parent } = event;
    const parentData = await parent();
    // const { selectedServer } = parentData;

    let data = {
      server: {},
      connectedServerCount: 0,
    };

    if (parentData.NETWORK_ERROR) {
      return data;
    }

    // await loadData({ request: event, selectedServer }).then((body) => {
    //   data = { ...data, ...body };
    // });

    return data;
  }
</script>

<script>
  import { getContext } from "svelte";
  import { _ } from "svelte-i18n";

  import DateComponent from "$lib/component/Date.svelte";

  const pageTitle = getContext("pageTitle");

  pageTitle.set("pages.server.monitoring.title");

  export let data;
</script>
