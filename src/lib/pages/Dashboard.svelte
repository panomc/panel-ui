<!-- Dashboard Page -->
<div class="container">
  <!-- Welcome Alerts -->
  {#if data.getting_started_blocks.welcome_board}
    <div
      class="alert alert-primary bg-minecraft alert-dismissible animate__animated animate__zoomIn mb-3"
    >
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
          <p>Pano'yu oyun sunucunuza bağlayın ve daha fazla yönetim özelliklerine erişin.</p>
          <button
            class="btn btn-sm btn-primary"
            data-bs-target="#connectServer"
            data-bs-toggle="modal"
          >
            <i class="fas fa-plus mr-2"></i>
            Sunucu Bağla
          </button>
        </div>
        <div class="col-lg-4 mb-lg-0 mb-3">
          <ul class="list-unstyled mb-1">
            <h5>Menüden Öneriler</h5>
            <li>
              <a class="alert-link" href="{base}/posts/create-post">
                <i class="fas fa-pen mr-2"></i>
                İlk Yazınızı Yayınlayın
              </a>
            </li>
            <li>
              <a class="alert-link" href="{base}/view">
                <i class="fas fa-brush mr-1"></i>
                Sitenizin Görünümünü Belirleyin
              </a>
            </li>
            <li>
              <a class="alert-link" href="{base}/tools">
                <i class="fas fa-tools mr-2"></i>
                Araçları Yönetin
              </a>
            </li>
            <li>
              <a class="alert-link" href="{base}/players">
                <i class="fas fa-user-cog mr-2"></i>
                Oyuncularınızı İnceleyin
              </a>
            </li>
          </ul>
        </div>
        <div class="col-lg-4 mb-lg-0 mb-3">
          <ul class="list-unstyled mb-2">
            <h5>Daha Fazlası</h5>
            <li>
              <a class="alert-link" href="javascript:void(0);">
                <i class="fas fa-puzzle-piece mr-2"></i>
                Pano Eklentilerini Keşfedin
              </a>
            </li>
            <li>
              <a class="alert-link" href="javascript:void(0);">
                <i class="fas fa-palette mr-2"></i>
                Pano Temalarını Keşfedin
              </a>
            </li>
            <li>
              <a class="alert-link" href="javascript:void(0);" target="_blank">
                <i class="fas fa-book-open mr-2"></i>
                Dökümantasyonları İnceleyin
              </a>
            </li>
            <li>
              <a
                class="alert-link"
                href="https://panomc.com/discord"
                target="_blank"
              >
                <i class="fab fa-discord mr-2"></i>
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
    class="row my-3 justify-content-between animate__animated animate__fadeIn"
  >
    <div class="col-auto">
      <div class="text-secondary">
        <div class="row align-items-center">
          <div class="col-auto">
            <h2 class="mb-0">12</h2>
          </div>
          <div class="col-auto">Çevrimiçi</div>
        </div>
      </div>
    </div>
    <div class="col-auto">
      <div class="text-warning">
        <div class="row align-items-center">
          <div class="col-auto">
            <h2 class="mb-0">
              {data.registered_player_count}
            </h2>
          </div>
          <div class="col-auto">Yeni Kayıt</div>
        </div>
      </div>
    </div>
    <div class="col-auto">
      <div class="text-bittersweet">
        <div class="row align-items-center">
          <div class="col-auto">
            <h2 class="mb-0">
              {data.registered_player_count}
            </h2>
          </div>
          <div class="col-auto">Toplam Oyuncu</div>
        </div>
      </div>
    </div>
  </div>

  <div class="card">
    <div class="card-body">
      <div class="row justify-content-between mb-3">
        <div class="col">
          <h5 class="card-title">Website Aktivitesi</h5>
        </div>
        <div class="col-auto">
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
      <div class="row justify-content-between mb-3">
        <div class="col">
          <h5 class="card-title">Son Talepler</h5>
        </div>
        <div class="col-auto text-right">
          <a href="{base}/tickets" class="btn btn-link bg-light btn-sm">
            Tüm Talepler
          </a>
        </div>
      </div>

      {#if data.tickets.length === 0}
        <div class="container text-center animate__animated animate__zoomIn">
          <i class="fas fa-ticket-alt fa-3x m-3 text-dark text-opacity-25"></i>
          <p class="text-gray">Burada içerik yok.</p>
        </div>
      {:else}
        <ul class="list-group">
          {#each data.tickets as ticket, index (ticket)}
            <a
              href="{base}/tickets/ticket/{ticket.id}"
              class="list-group-item list-group-item-action rounded d-flex flex-row"
            >
              <div class="text-primary">
                {ticket.title}
                <br />
                <small class="text-muted">
                  <b> <Date time="{ticket.last_update}" /> </b>,
                  <a href="{base}/tickets/category/{ticket.category.title}">
                    <b>{ticket.category.title}</b>
                  </a>
                  kategorisine açıldı.
                </small>
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
      <div class="table-responsive animate__animated animate__fadeIn">
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
  import { showNetworkErrorOnCatch } from "$lib/store.js";
  import ApiUtil from "$lib/api.util.js";

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
  import { pageTitle } from "$lib/store.js";

  import VisitorsChart from "$lib/component/charts/Dashboard/VisitorsChart.svelte";
  // import PlayersChart from "$lib/component/charts/Dashboard/PlayersChart.svelte";
  // import TrafficChart from "$lib/component/charts/Dashboard/TrafficChart.svelte";
  import TicketStatus from "$lib/component/TicketStatus.svelte";
  import Date from "$lib/component/Date.svelte";

  export let data;

  pageTitle.set("İstatistikler");

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
