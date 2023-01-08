<!-- Dashboard Page -->
<div class="container">
  <!-- Welcome Alerts -->
  {#if data.gettingStartedBlocks.welcomeBoard}
    <div
      class="alert alert-primary bg-minecraft alert-dismissible animate__animated animate__zoomIn mb-3">
      <div class="row">
        <div class="col-12 pb-3">
          <h3 class="card-title">Hoş Geldiniz</h3>
          <p class="lead fw-bold">
            Pano, web sunucunuza başarıyla kuruldu ve kullanıma hazır! 🚀
            <br />
            İşte başlarken yapabilecekleriniz 👇:
          </p>
        </div>
        <div class="col-lg-4 mb-lg-0 mb-3">
          <h5>Sunucu Bağlayın</h5>
          <p>
            Pano'yu oyun sunucunuza bağlayın ve daha fazla yönetim özelliklerine
            erişin.
          </p>
          <button
            class="btn btn-sm btn-primary"
            data-bs-target="#connectServer"
            data-bs-toggle="modal">
            <i class="fas fa-plus me-2"></i>
            Sunucu Bağla
          </button>
        </div>
        <div class="col-lg-4 mb-lg-0 mb-3">
          <ul class="list-unstyled">
            <h5>Menüden Öneriler</h5>
            <li>
              <a class="alert-link" href="{base}/posts/create-post">
                <i class="fas fa-pen me-2"></i>
                İlk Yazınızı Yayınlayın
              </a>
            </li>
            <li>
              <a class="alert-link" href="{base}/view">
                <i class="fas fa-brush me-2"></i>
                Sitenizin Görünümünü Belirleyin
              </a>
            </li>
            <li>
              <a class="alert-link" href="{base}/tools">
                <i class="fas fa-tools me-2"></i>
                Araçları Yönetin
              </a>
            </li>
            <li>
              <a class="alert-link" href="{base}/players">
                <i class="fas fa-user-cog me-2"></i>
                Oyuncularınızı İnceleyin
              </a>
            </li>
          </ul>
        </div>
        <div class="col-lg-4 mb-lg-0 mb-3">
          <ul class="list-unstyled">
            <h5>Daha Fazlası</h5>
            <li>
              <a class="alert-link" href="javascript:void(0);">
                <i class="fas fa-puzzle-piece me-2"></i>
                Pano Eklentilerini Keşfedin
              </a>
            </li>
            <li>
              <a class="alert-link" href="javascript:void(0);">
                <i class="fas fa-palette me-2"></i>
                Pano Temalarını Keşfedin
              </a>
            </li>
            <li>
              <a class="alert-link" href="javascript:void(0);" target="_blank">
                <i class="fas fa-book-open me-2"></i>
                Dökümantasyonları İnceleyin
              </a>
            </li>
            <li>
              <a
                class="alert-link"
                href="https://panomc.com/discord"
                target="_blank">
                <i class="fab fa-discord me-2"></i>
                Discord Topluluğumuza Katılın
              </a>
            </li>
          </ul>
        </div>
      </div>

      <button
        type="button"
        class="btn-close"
        data-bs-dismiss="alert"
        on:click="{onCloseGettingStartedCard}"></button>
    </div>
  {/if}

  <div
    class="row my-3 justify-content-between animate__animated animate__slideInUp">
    <div class="col-4">
      <div class="card bg-transparent">
        <div class="card-body">
          <p
            class="mb-0 lead text-secondary text-center"
            use:tooltip="{['Website', { placement: 'bottom' }]}">
            12 Çevrimiçi
          </p>
        </div>
      </div>
    </div>
    <div class="col-4">
      <div class="card bg-transparent">
        <div class="card-body">
          <p class="mb-0 lead text-primary text-center">
            {data.newRegisterCount} Yeni Kayıt
          </p>
        </div>
      </div>
    </div>
    <div class="col-4">
      <div class="card bg-transparent">
        <div class="card-body">
          <p class="mb-0 lead text-danger text-center">
            {data.registeredPlayerCount} Toplam Oyuncu
          </p>
        </div>
      </div>
    </div>
  </div>

  <div class="card mb-3">
    <div class="card-body">
      <div class="row justify-content-between mb-3">
        <div class="col">
          <h5 class="card-title">Website Aktivitesi</h5>
        </div>
        <div class="col-auto">
          <div class="btn-group">
            <button
              class="btn btn-sm btn-outline-light btn-link"
              class:active="{data.period === DashboardPeriod.WEEK}"
              on:click="{() => reloadDataByPeriod()}"
              class:disabled="{reloading}">
              Hafta
            </button>
            <button
              class="btn btn-sm btn-outline-light btn-link"
              class:active="{data.period === DashboardPeriod.MONTH}"
              on:click="{() => reloadDataByPeriod(DashboardPeriod.MONTH)}"
              class:disabled="{reloading}">
              Ay
            </button>
          </div>
        </div>
      </div>
      <WebsiteActivityChart
        newRegisterData="{data.websiteActivityDataList.newRegisterData}"
        ticketsData="{data.websiteActivityDataList.ticketsData}"
        visitorData="{data.websiteActivityDataList.visitorData}"
        viewData="{data.websiteActivityDataList.viewData}"
        period="{data.period}" />
    </div>
  </div>

  {#if hasPermission(Permissions.MANAGE_TICKETS)}
    <!-- Latest Tickets -->
    <div class="card mb-3">
      <div class="card-body">
        <div class="row justify-content-between mb-3">
          <div class="col">
            <h5 class="card-title">Son Talepler</h5>
          </div>
        </div>

        {#if data.tickets.length === 0}
          <NoContent />
        {:else}
          <table class="table table-borderless table-hover mb-0">
            {#each data.tickets as ticket, index (ticket)}
              <tbody>
                <tr>
                  <td class="align-middle">
                    <a
                      use:tooltip="{[
                        ticket.writer.username,
                        { placement: 'bottom' },
                      ]}"
                      href="{base}/players/player/{ticket.writer.username}">
                      <img
                        src="https://crafthead.net/avatar/{ticket.writer
                          .username}/32"
                        alt="Oyuncu Adı"
                        class="rounded-circle animate__animated animate__zoomIn"
                        height="32"
                        width="32" />
                    </a>
                  </td>
                  <td class="align-middle text-nowrap">
                    <a
                      href="{base}/tickets/ticket/{ticket.id}"
                      title="Görüntüle">#{ticket.id} {ticket.title}</a>
                  </td>
                  <td class="align-middle text-nowrap">
                    <a
                      title="Filtrele"
                      href="{base}/tickets/category/{ticket.category.url}">
                      {ticket.category.title === "-"
                        ? "Kategorisiz"
                        : ticket.category.title}
                    </a>
                  </td>
                  <td class="align-middle text-nowrap">
                    <TicketStatusBadge status="{ticket.status}" />
                  </td>
                  <td class="align-middle text-nowrap"
                    ><span><Date time="{ticket.lastUpdate}" /></span></td>
                </tr>
              </tbody>
            {/each}
          </table>
        {/if}
      </div>
    </div>
  {/if}
  <!-- Statistic Table -->
  <div class="card">
    <div class="card-body">
      <h5 class="card-title">İstatistik</h5>
      <div class="table-responsive">
        <table class="table table-borderless table-hover m-0">
          <tbody class="text-muted">
            <tr>
              <th scope="row">Yazılar:</th>
              <td>{data.postCount}</td>
            </tr>
            <tr>
              <th scope="row">Oyuncular:</th>
              <td>{data.registeredPlayerCount}</td>
            </tr>
            <tr>
              <th scope="row">Yöneticiler:</th>
              <td>{data.adminCount}</td>
            </tr>
            <tr>
              <th scope="row">Talepler:</th>
              <td>{data.ticketCount}</td>
            </tr>
            <tr>
              <th scope="row">Sunucular:</th>
              <td>{data.connectedServerCount}</td>
            </tr>
            <tr>
              <th scope="row">Eklentiler:</th>
              <td>?</td>
            </tr>
            <tr>
              <th scope="row">Temalar:</th>
              <td>?</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</div>

<script context="module">
  import { showNetworkErrorOnCatch } from "$lib/Store.js";
  import ApiUtil from "$lib/api.util.js";

  export const DashboardPeriod = Object.freeze({
    WEEK: "week",
    MONTH: "month",
  });

  async function loadData({ period, request }) {
    return new Promise((resolve, reject) => {
      ApiUtil.get({
        path: `/api/panel/dashboard?period=${period}`,
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

    let data = {
      gettingStartedBlocks: {
        welcomeBoard: false,
      },
      registeredPlayerCount: 0,
      postCount: 0,
      ticketCount: 0,
      openTicketCount: 0,
      tickets: [],
      adminCount: 0,
      connectedServerCount: 0,
      newRegisterCount: 0,
      period: "",
      websiteActivityDataList: {},
    };

    if (parentData.stuff.NETWORK_ERROR) {
      return data;
    }

    await loadData({ period: DashboardPeriod.WEEK, request: event }).then(
      (body) => {
        data = { ...data, ...body };
      }
    );

    return data;
  }
</script>

<script>
  import { base } from "$app/paths";
  import { pageTitle } from "$lib/Store.js";

  import tooltip from "$lib/tooltip.util";

  import WebsiteActivityChart from "$lib/component/charts/Dashboard/WebsiteActivityChart.svelte";
  // import PlayersChart from "$lib/component/charts/Dashboard/PlayersChart.svelte";
  // import TrafficChart from "$lib/component/charts/Dashboard/TrafficChart.svelte";
  import TicketStatusBadge from "$lib/component/badges/TicketStatusBadge.svelte";
  import Date from "$lib/component/Date.svelte";
  import NoContent from "$lib/component/NoContent.svelte";

  import { hasPermission, Permissions } from "$lib/auth.util.js";

  export let data;
  let reloading = false;

  pageTitle.set("İstatistikler");

  function onCloseGettingStartedCard() {
    showNetworkErrorOnCatch((resolve, reject) => {
      ApiUtil.post({
        path: "/api/panel/dashboard/closeGettingStartedCard",
      })
        .then(() => {
          resolve();
        })
        .catch(() => {
          reject();
        });
    });
  }

  function reloadDataByPeriod(period = DashboardPeriod.WEEK) {
    if (data.period === period) {
      return;
    }

    reloading = true;

    showNetworkErrorOnCatch((resolve, reject) => {
      loadData({ period })
        .then((loadedData) => {
          resolve();

          data = loadedData;
          reloading = false;
        })
        .catch(() => {
          reject();
        });
    });
  }
</script>
