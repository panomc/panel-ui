<div class="container">
  <div
    class="row justify-content-between mb-3 animate__animated animate__slideInUp">
    <div class="col-4">
      <div
        class="card"
        class:bg-mint="{data.server.status === ServerStatus.ONLINE}"
        class:bg-danger="{data.server.status === ServerStatus.OFFLINE}">
        <div class="card-body">
          <p class="mb-0 lead text-white">
            Sunucu {#if data.server.status === ServerStatus.ONLINE}Çevrimiçi{:else}Çevrimdışı{/if}
          </p>
        </div>
      </div>
    </div>
    <div class="col-4">
      <div class="card">
        <div class="card-body">
          <p class="mb-0 lead text-primary text-center">
            {data.server.playerCount}/{data.server.maxPlayerCount} Oyuncu
          </p>
        </div>
      </div>
    </div>
    <div class="col-4">
      <div class="card">
        <div class="card-body">
          <p class="mb-0 lead text-dark text-center">
            {#if data.server.status === ServerStatus.ONLINE}Çalışma Süresi: {getUptime(
                data.server.startTime,
                checkTime
              )}
            {:else}
              Son Aktif Zamanı: <DateComponent time="{data.server.stopTime}" />
            {/if}
          </p>
        </div>
      </div>
    </div>
  </div>

  <!-- Statistic Table -->
  <div class="card">
    <div class="card-body">
      <h5 class="card-title">İstatistik</h5>
      <div class="table-responsive">
        <table class="table table-borderless table-hover m-0">
          <tbody class="text-muted">
            <tr>
              <th scope="row">Sunucu İsmi:</th>
              <td>{data.server.name}</td>
            </tr>
            <tr>
              <th scope="row">Sunucu Türü:</th>
              <td>{data.server.type}</td>
            </tr>
            <tr>
              <th scope="row">Local IP Adresi:</th>
              <td>{data.server.host}:{data.server.port}</td>
            </tr>
            <tr>
              <th scope="row">Sunucu Sürümü:</th>
              <td>{data.server.version}</td>
            </tr>
            <tr>
              <th scope="row">Toplam Bağlı Sunucular:</th>
              <td>{data.connectedServerCount}</td>
            </tr>
            <tr>
              <th scope="row">Eklenme Zamanı:</th>
              <td><DateComponent time="{data.server.acceptedTime}" /></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</div>

<script context="module">
  import ApiUtil from "$lib/api.util.js";
  import { get } from "svelte/store";

  export const ServerStatus = Object.freeze({
    ONLINE: "ONLINE",
    OFFLINE: "OFFLINE",
  });

  async function loadData({ request, selectedServer }) {
    return new Promise((resolve, reject) => {
      ApiUtil.get({
        path: `/api/panel/servers/${get(selectedServer).id}/dashboard`,
        request,
      }).then((body) => {
        if (body.result === "ok") {
          resolve(body);
        } else {
          reject(body);
        }
      });
    });
  }

  /**
   * @type {import('@sveltejs/kit').PageLoad}
   */
  export async function load(event) {
    const { parent } = event;
    const parentData = await parent();
    const { selectedServer } = parentData;

    let data = {
      server: {},
      connectedServerCount: 0,
    };

    if (parentData.NETWORK_ERROR) {
      return data;
    }

    await loadData({ request: event, selectedServer }).then((body) => {
      data = { ...data, ...body };
    });

    return data;
  }
</script>

<script>
  import { onDestroy, onMount } from "svelte";
  import { differenceInCalendarDays, intervalToDuration } from "date-fns";

  import { page } from "$app/stores";

  import DateComponent from "$lib/component/Date.svelte";

  const { pageTitle } = $page.data;

  pageTitle.set("Sunucu İstatistikleri");

  export let data;

  let checkTime = 0;
  let interval;

  function getUptime(time, checkTime) {
    const now = new Date();

    const duration = intervalToDuration({
      start: time,
      end: now,
    });

    const days = differenceInCalendarDays(time, now);
    const hours = duration["hours"];
    const minutes = duration["minutes"];
    const seconds = duration["seconds"];

    return `${days}:${hours}:${minutes}:${seconds}`;
  }

  onMount(() => {
    interval = setInterval(() => {
      checkTime += 1;
    }, 1000);
  });

  onDestroy(() => {
    clearInterval(interval);
  });
</script>
