<svelte:head>
  <title>{getTitle("İstatistikler")}</title>
</svelte:head>

<!-- Dashboard Page -->
<div class="container">
  <!-- Welcome Alerts -->
  {#if data.getting_started_blocks.welcome_board}
    <div
      class="alert alert-welcome alert-dismissible flex-fill w-100
      show border mb-4"
      role="alert"
    >
      <button
        class="close"
        data-dismiss="alert"
        type="button"
        on:click="{onCloseGettingStartedCard}"
      >
        <span aria-hidden="true">&times;</span>
      </button>
      <div class="card-body">
        <div class="row">
          <div class="col-12">
            <h4 class="card-title">Hoş Geldiniz</h4>
            <p>
              Pano kullanıma hazır! İşte başlarken yapabileceklerinizden
              bazıları:
            </p>
          </div>
          <div class="col-lg-4 mb-lg-0 mb-3">
            <h5>Sunucu Bağlayın</h5>
            <p>
              Oyun sunucunuzu platforma bağlayın ve sunucu bilgilerine panel
              üzerinden erişin.
            </p>
            <button
              class="btn btn-sm btn-outline-primary"
              data-target="#connectServer"
              data-toggle="modal"
            >
              <i class="fas fa-plus mr-2"></i>
              Sunucu Bağla
            </button>
          </div>
          <div class="col-lg-4 mb-lg-0 mb-3">
            <ul class="list-unstyled mb-1">
              <h5>Başlarken</h5>
              <li>
                <a href="{base}/posts/create-post">
                  <i class="fas fa-pen mr-1"></i>
                  İlk Yazınızı Yayınlayın
                </a>
              </li>
              <li>
                <a href="{base}/view">
                  <i class="fas fa-brush mr-1"></i>
                  Sitenizin Görünümünü Belirleyin
                </a>
              </li>
              <li>
                <a href="{base}/tools">
                  <i class="fas fa-tools mr-1"></i>
                  Araçları Yönetin
                </a>
              </li>
              <li>
                <a href="{base}/players">
                  <i class="fas fa-user-cog mr-1"></i>
                  Oyuncularınızı İnceleyin
                </a>
              </li>
            </ul>
          </div>
          <div class="col-lg-4 mb-lg-0 mb-3">
            <ul class="list-unstyled mb-1">
              <h5>Daha Fazlası</h5>
              <li>
                <a href="javascript:void(0);">
                  <i class="fas fa-puzzle-piece mr-1"></i>
                  Eklenti Ekleyin
                </a>
              </li>
              <li>
                <a href="javascript:void(0);">
                  <i class="fas fa-palette mr-1"></i>
                  Tema Ekleyin
                </a>
              </li>
              <li>
                <a href="javascript:void(0);" target="_blank">
                  <i class="fas fa-book-open mr-1"></i>
                  Dökümantasyonları İnceleyin
                </a>
              </li>
              <li>
                <a href="https://panomc.com/discord" target="_blank">
                  <i class="fab fa-discord mr-1"></i>
                  Discord Topluluğumuza Katılın
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  {/if}

  <div class="row justify-content-between animate__animated animate__slideInUp">
    <div class="col-lg-4">
      <div class="card border-0 bg-transparent">
        <div class="p-3">
          <div class="row align-items-center">
            <div class="col-auto">
              <i class="fas fa-globe fa-2x text-gray d-block mr-5"></i>
            </div>
            <div class="col">
              <h3 class="font-weight-bolder text-primary">12</h3>
              <span class="text-primary">Çevrimiçi</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="col-lg-4">
      <div class="card border-0 bg-transparent">
        <div class="p-3">
          <div class="row align-items-center">
            <div class="col-auto">
              <i class="fas fa-user-plus fa-2x text-gray d-block mr-5"></i>
            </div>
            <div class="col">
              <h3 class="font-weight-bolder text-primary">
                {data.registered_player_count}
                <i class="fas fa-caret-up ml-2"></i>
              </h3>
              <span class="text-primary">Yeni Kayıt</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="col-lg-4">
      <div class="card border-0 bg-transparent">
        <div class="p-3">
          <div class="row align-items-center">
            <div class="col-auto">
              <i class="fas fa-users fa-2x text-gray d-block mr-5"></i>
            </div>
            <div class="col">
              <h3 class="font-weight-bolder text-primary">
                {data.registered_player_count}
              </h3>
              <span class="text-primary">Toplam Oyuncu</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div class="card">
    <div class="card-body">
      <div class="row justify-content-between">
        <div class="col-4">
          <h5 class="card-title">Website Aktivitesi</h5>
        </div>
        <div class="col-8 text-right">
          <div class="btn-group">
            <button class="btn btn-sm btn-outline-light btn-link active">
              Haftalık
            </button>
            <button class="btn btn-sm btn-outline-light btn-link">
              Aylık
            </button>
          </div>
        </div>
      </div>
      <VisitorsChart />
    </div>
  </div>

  <!-- Latest Tickets -->
  <div class="card">
    <div class="card-body">
      <div class="row justify-content-between">
        <div class="col-6">
          <h5 class="card-title">Son Talepler</h5>
        </div>
        <div class="col-6 text-right">
          <a href="{base}/tickets" class="btn btn-link bg-light btn-sm">
            Tüm Talepler
          </a>
        </div>
      </div>

      {#if data.tickets.length === 0}
        <div
          class="container text-center animate__animated animate__headShake animate__slower"
        >
          <i class="fas fa-ticket-alt fa-3x text-glass m-3"></i>
          <p class="text-gray">Burada içerik yok.</p>
        </div>
      {:else}
        <ul class="list-group">
          {#each data.tickets as ticket, index (ticket)}
            <a
              href="{base}/tickets/ticket/{ticket.id}"
              class="list-group-item list-group-item-action rounded d-flex flex-row"
            >
              <a href="{base}/players/player/{ticket.writer.username}">
                <div
                  class="col-auto"
                  use:tooltip="{[
                    ticket.writer.username,
                    { placement: 'bottom' },
                  ]}"
                >
                  <img
                    src="https://minotar.net/avatar/{ticket.writer.username}"
                    alt="{ticket.writer.username}"
                    width="48"
                    height="48"
                    class="border rounded-circle"
                  />
                </div>
              </a>
              <div class="col">
                <span class="text-primary"> #{ticket.id} {ticket.title} </span>
                <br />
                <small class="text-muted">
                  <b> <Date time="{ticket.last_update}" /> </b>,
                  <a href="{base}/tickets/category/{ticket.category.title}">
                    <b>{ticket.category.title}</b>
                  </a>
                  kategorisine açıldı.
                </small>
              </div>
              <div class="col-auto d-flex align-items-center">
                <TicketStatus status="{ticket.status}" />
              </div>
            </a>
          {/each}
        </ul>
      {/if}
    </div>
  </div>

  <!-- Statistic Table -->
  <div class="card">
    <div class="card-body">
      <h5 class="card-title">İstatistik</h5>
      <div class="table-responsive">
        <table class="table table-sm m-0">
          <tbody class="text-muted">
            <tr>
              <th scope="row">Yazılar:</th>
              <td>{data.post_count}</td>
            </tr>
            <tr>
              <th scope="row">Oyuncular:</th>
              <td>{data.registered_player_count}</td>
            </tr>
            <tr>
              <th scope="row">Yöneticiler:</th>
              <td>?</td>
            </tr>
            <tr>
              <th scope="row">Talepler:</th>
              <td>{data.tickets_count}</td>
            </tr>
            <tr>
              <th scope="row">Bağlı Sunucular:</th>
              <td>?</td>
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
  import { showNetworkErrorOnCatch } from "$lib/store";
  import ApiUtil from "$lib/api.util";

  async function loadData({ request, CSRFToken }) {
    return new Promise((resolve, reject) => {
      ApiUtil.get({
        path: "/api/panel/initPage/dashboard",
        request,
        CSRFToken,
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
   * @type {import('@sveltejs/kit').Load}
   */
  export async function load(request) {
    let output = {
      props: {
        data: {
          getting_started_blocks: {
            welcome_board: false,
          },
          registered_player_count: 0,
          post_count: 0,
          tickets_count: 0,
          open_tickets_count: 0,
          tickets: [],
        },
      },
    };

    if (request.stuff.NETWORK_ERROR) {
      output.props.data.NETWORK_ERROR = true;

      return output;
    }

    await loadData({ request }).then((body) => {
      output.props.data = { ...output.props.data, ...body };
    });

    return output;
  }
</script>

<script>
  import { base } from "$app/paths";
  import { session } from "$app/stores";

  import tooltip from "$lib/tooltip.util";
  import { getTitle } from "$lib/title.util";

  import VisitorsChart from "../components/charts/Dashboard/VisitorsChart.svelte";
  // import PlayersChart from "../components/charts/Dashboard/PlayersChart.svelte";
  // import TrafficChart from "../components/charts/Dashboard/TrafficChart.svelte";
  import TicketStatus from "../components/TicketStatus.svelte";
  import Date from "../components/Date.svelte";

  export let data;

  if (data.NETWORK_ERROR) {
    showNetworkErrorOnCatch((resolve, reject) => {
      loadData({ CSRFToken: $session.CSRFToken })
        .then((body) => {
          data = { ...data, ...body };
          resolve();
        })
        .catch(() => {
          reject();
        });
    }, true);
  }

  function onCloseGettingStartedCard() {
    showNetworkErrorOnCatch((resolve, reject) => {
      ApiUtil.post({
        path: "/api/panel/dashboard/closeGettingStartedCard",
        CSRFToken: $session.CSRFToken,
      })
        .then(() => {
          resolve();
        })
        .catch(() => {
          reject();
        });
    });
  }
</script>
