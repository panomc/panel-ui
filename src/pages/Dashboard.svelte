<!-- Dashboard Page -->
<div class="container">
  <!-- Welcome Alerts -->
  {#if getting_started_blocks.welcome_board}
    <div
      class="alert alert-welcome alert-dismissible flex-fill w-100
      show border mb-4"
      role="alert">
      <button
        class="close"
        data-dismiss="alert"
        type="button"
        on:click="{onCloseGettingStartedCard}">
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
              data-toggle="modal">
              <Icon data="{faPlus}" class="mr-2" />
              Sunucu Bağla
            </button>
          </div>
          <div class="col-lg-4 mb-lg-0 mb-3">
            <ul class="list-unstyled mb-1">
              <h5>Başlarken</h5>
              <li>
                <a href="panel/posts/create-post">
                  <Icon data="{faPen}" class="mr-1" />
                  İlk Yazınızı Yayınlayın
                </a>
              </li>
              <li>
                <a href="panel/view">
                  <Icon data="{faBrush}" class="mr-1" />
                  Sitenizin Görünümünü Belirleyin
                </a>
              </li>
              <li>
                <a href="panel/tools">
                  <Icon data="{faTools}" class="mr-1" />
                  Araçları Yönetin
                </a>
              </li>
              <li>
                <a href="panel/players">
                  <Icon data="{faUserCog}" class="mr-1" />
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
                  <Icon data="{faPuzzlePiece}" class="mr-1" />
                  Eklenti Ekleyin
                </a>
              </li>
              <li>
                <a href="javascript:void(0);">
                  <Icon data="{faPalette}" class="mr-1" />
                  Tema Ekleyin
                </a>
              </li>
              <li>
                <a href="javascript:void(0);" target="_blank">
                  <Icon data="{faBookOpen}" class="mr-1" />
                  Dökümantasyonları İnceleyin
                </a>
              </li>
              <li>
                <a href="https://panomc.com/discord" target="_blank">
                  <Icon data="{faDiscord}" class="mr-1" />
                  Discord Topluluğumuza Katılın
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  {/if}

  <div class="row justify-content-between">
    <div class="col-lg-4">
      <div class="card border-0 bg-transparent">
        <div class="p-3">
          <div class="row align-items-center">
            <div class="col-auto">
              <Icon
                data="{faGlobe}"
                scale="2.3"
                class="text-gray d-block mr-5" />
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
              <Icon
                data="{faUserPlus}"
                scale="2.3"
                class="text-gray d-block mr-5" />
            </div>
            <div class="col">
              <h3 class="font-weight-bolder text-primary">
                {registered_player_count}
                <Icon data="{faCaretUp}" class="ml-2" />
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
              <Icon
                data="{faUsers}"
                scale="2.3"
                class="text-gray d-block mr-5" />
            </div>
            <div class="col">
              <h3 class="font-weight-bolder text-primary">
                {registered_player_count}
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
          <a href="/panel/tickets" class="btn btn-link bg-light btn-sm">
            Tüm Talepler
          </a>
        </div>
      </div>

      {#if tickets.length === 0}
        <div class="container text-center">
          <Icon data="{faTicketAlt}" scale="3" class="text-glass m-3" />
          <p class="text-gray">Burada içerik yok.</p>
        </div>
      {:else}
        <ul class="list-group">
          {#each tickets as ticket, index (ticket)}
            <a
              href="/panel/tickets/ticket/{ticket.id}"
              class="list-group-item list-group-item-action rounded d-flex flex-row">
              <a href="/panel/players/player/{ticket.writer.username}">
                <div
                  class="col-auto"
                  use:tooltip="{['bottom', ticket.writer.username]}">
                  <img
                    src="https://minotar.net/avatar/{ticket.writer.username}"
                    alt="{ticket.writer.username}"
                    width="48"
                    height="48"
                    class="border rounded-circle" />
                </div>
              </a>
              <div class="col">
                <span class="text-primary"> #{ticket.id} {ticket.title} </span>
                <br />
                <small class="text-muted">
                  <b> <Date time="{ticket.last_update}" /> </b>,
                  <b>{ticket.category.title}</b>
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
              <td>{post_count}</td>
            </tr>
            <tr>
              <th scope="row">Oyuncular:</th>
              <td>{registered_player_count}</td>
            </tr>
            <tr>
              <th scope="row">Yöneticiler:</th>
              <td>?</td>
            </tr>
            <tr>
              <th scope="row">Talepler:</th>
              <td>{tickets_count}</td>
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

<script>
  import { isPageInitialized, showNetworkErrorOnCatch } from "../Store";

  import Icon from "svelte-awesome";
  import { faStickyNote } from "@fortawesome/free-regular-svg-icons";
  import {
    faBookOpen,
    faBrush,
    faCaretUp,
    faGlobe,
    faPalette,
    faPen,
    faPlus,
    faPuzzlePiece,
    faTicketAlt,
    faTools,
    faUsers,
    faUserPlus,
    faUserCog,
  } from "@fortawesome/free-solid-svg-icons";
  import { faDiscord } from "@fortawesome/free-brands-svg-icons";

  import ApiUtil from "../pano-ui/js/api.util";

  import VisitorsChart from "../components/charts/Dashboard/VisitorsChart.svelte";
  import PlayersChart from "../components/charts/Dashboard/PlayersChart.svelte";
  import TrafficChart from "../components/charts/Dashboard/TrafficChart.svelte";
  import TicketStatus from "../components/TicketStatus.svelte";
  import Date from "../components/Date.svelte";
  import tooltip from "../pano-ui/js/tooltip.util";

  let getting_started_blocks = {
    welcome_board: false,
  };

  let registered_player_count = 0;
  let post_count = 0;
  let tickets_count = 0;
  let open_tickets_count = 0;
  let tickets = [];

  function getInitialData() {
    showNetworkErrorOnCatch((resolve, reject) => {
      ApiUtil.get("panel/initPage/dashboard")
        .then((response) => {
          if (response.data.result === "ok") {
            registered_player_count = response.data.registered_player_count;
            post_count = response.data.post_count;
            tickets_count = response.data.tickets_count;
            open_tickets_count = response.data.open_tickets_count;
            tickets = response.data.tickets;

            getting_started_blocks = response.data.getting_started_blocks;

            isPageInitialized.set(true);

            resolve();
          } else reject();
        })
        .catch(() => {
          reject();
        });
    });
  }

  function onCloseGettingStartedCard() {
    showNetworkErrorOnCatch((resolve, reject) => {
      ApiUtil.post("panel/dashboard/closeGettingStartedCard", {})
        .then(() => {
          resolve();
        })
        .catch(() => {
          reject();
        });
    });
  }

  getInitialData();
</script>
