<script>
  import { getPath, route } from "routve";
  import moment from "moment";

  import Icon from "svelte-awesome";
  import {
    faTicketAlt,
    faArrowLeft,
    faTimes,
    faUserCircle,
    faEllipsisV,
  } from "@fortawesome/free-solid-svg-icons";

  import { isPageInitialized, showNetworkErrorOnCatch } from "../../Store";
  import ConfirmBanPlayerModal from "../../components/modals/ConfirmBanPlayerModal.svelte";
  import TicketStatus from "../../components/TicketStatus.svelte";
  import Date from "../../components/Date.svelte";

  import ApiUtil from "../../pano/js/api.util";
  import Pagination from "../../components/Pagination.svelte";

  export let username = "";
  export let page = undefined;

  let player = {
    username: "",
    isBanned: false,
    registerDate: 0,
    permission: "",
  };
  let tickets = [];
  let ticketCount = 0;
  let ticketTotalPage = 1;

  function getPlayerDetail(username, pageNumber, forceReload = false) {
    if (pageNumber !== page || forceReload) {
      showNetworkErrorOnCatch((resolve, reject) => {
        ApiUtil.post("panel/initPage/playerDetail", {
          username,
          page: pageNumber,
        })
          .then((response) => {
            if (response.data.result === "ok") {
              player = response.data.player;
              tickets = response.data.tickets;
              ticketCount = response.data.ticketCount;
              ticketTotalPage = response.data.ticketTotalPage;

              page = pageNumber;

              if (
                page === 1 &&
                getPath() !== "/panel/players/player/" + username &&
                getPath() !== "/panel/players/player/" + username + "/"
              )
                route("/panel/players/player/" + username + "/" + page);
              else if (page !== 1)
                route("/panel/players/player/" + username + "/" + page);

              isPageInitialized.set(true);

              resolve();
            } else if (
              response.data.error === "NOT_EXISTS" ||
              response.data.error === "PAGE_NOT_FOUND"
            ) {
              route("/panel/error-404");

              resolve();
            } else reject();
          })
          .catch(() => {
            reject();
          });
      });
    }
  }

  $: {
    getPlayerDetail(username, typeof page === "undefined" ? 1 : parseInt(page));
  }
</script>

<!-- Player Detail Page -->

<div class="content">
  <!-- Action Menu -->
  <div class="row mb-3">
    <div class="col-md-4 col-6">
      <a class="btn btn-link" role="button" href="/panel/players">
        <Icon data="{faArrowLeft}" class="mr-1" />
        Oyuncular
      </a>
    </div>
    <div class="col text-right">
      <div class="dropdown">
        <a
          class="btn btn-link"
          aria-expanded="false"
          aria-haspopup="true"
          data-toggle="dropdown"
          href="javascript:void(0);"
          id="playerAction"
          title="Eylemler">
          <Icon data="{faEllipsisV}" />
        </a>
        <div
          aria-labelledby="playerAction"
          class="dropdown-menu dropdown-menu-right">
          <a class="dropdown-item" href="javascript:void(0);">
            <Icon data="{faUserCircle}" class="mr-1 text-primary" />
            Yetkilendir
          </a>
          <a
            class="dropdown-item"
            data-target="#conformBanPlayer"
            data-toggle="modal"
            href="javascript:void(0);">
            <Icon data="{faTimes}" class="mr-1 text-danger" />
            Yasakla
          </a>
        </div>
      </div>
    </div>
  </div>

  <div class="row">
    <div class="col-lg-3">
      <div class="card">
        <div
          class="card-body d-flex flex-column justify-content-center
          align-items-center">
          <img
            alt="{player.username}"
            class="mb-3 rounded-circle player-profile-icon border-lightsecondary"
            width="80"
            height="80"
            src="https://minotar.net/avatar/{player.username}" />

          <h4 class="card-title"><span>{player.username}</span></h4>
          {#if player.isBanned}
            <div class="badge badge-pill badge-danger d-block">Yasaklı</div>
          {/if}
          <hr />

          <ul class="list-inline my-0">
            <li class="list-inline-item">
              <div class="badge text-dark border text-capitalize">
                {player.permission === "" ? "Oyuncu" : player.permission}
              </div>
            </li>
            <li class="list-inline-item">
              <div class="badge text-dark border">
                Kayıt: {moment(parseInt(player.registerDate)).format(
                  "DD.MM.YYYY"
                )}
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div class="col-lg-9">
      <!-- User's Tickets -->
      <div class="card">
        <div class="card-body">
          <div class="row justify-content-between">
            <div class="col-6">
              <h5 class="card-title">
                {player.username} tarafından Son Talepler
              </h5>
            </div>
            <div class="col-6 text-right">
              <a href="/panel/tickets" class="btn btn-link bg-light btn-sm">
                Tüm Talepler
              </a>
            </div>
          </div>

          {#if ticketCount === 0}
            <div class="container text-center">
              <Icon data="{faTicketAlt}" scale="3" class="text-glass m-3" />
              <p class="text-gray">Burada içerik yok.</p>
            </div>
          {:else}
            {#each tickets as ticket, index (ticket)}
              <a
                href="/panel/tickets/ticket/{ticket.id}"
                class="list-group-item list-group-item-action rounded d-flex flex-row">
                <div class="col">
                  <span class="text-primary">
                    #{ticket.id}
                    {ticket.title}
                  </span>
                  <br />
                  <small class="text-muted">
                    <b><Date time="{ticket.last_update}" /></b>,
                    <b>{ticket.category.title}</b>
                    kategorisine açıldı.
                  </small>
                </div>
                <div class="col-auto d-flex align-items-center">
                  <TicketStatus status="{ticket.status}" />
                </div>
              </a>
            {/each}
          {/if}

          <!-- Pagination -->
          <Pagination
            page="{page}"
            totalPage="{ticketTotalPage}"
            on:firstPageClick="{() => getPlayerDetail(username, 1)}"
            on:lastPageClick="{() =>
              getPlayerDetail(username, ticketTotalPage)}"
            on:pageLinkClick="{(event) =>
              getPlayerDetail(username, event.detail.page)}" />
        </div>
      </div>
    </div>
  </div>
</div>

<!-- Ban Player Confirmation Modal -->
<ConfirmBanPlayerModal />
