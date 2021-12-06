<svelte:head>
  <title>{getTitle(data.player.username)}</title>
</svelte:head>

<!-- Player Detail Page -->
<div class="container">
  <!-- Action Menu -->
  <div class="row mb-3 animate__animated animate__slideInUp">
    <div class="col-md-4 col-6">
      <a class="btn btn-link" role="button" href="{base}/players">
        <i class="fas fa-arrow-left mr-1"></i>
        Oyuncular
      </a>
    </div>
    <div class="col text-right">
      <a
        class="btn btn-link"
        href="javascript:void(0);"
        on:click="{() => showAuthorizePlayerModal(data.player)}">
        <i class="fas fa-user-circle mr-1"></i>
        Yetkilendir
      </a>
      <a
        class="btn btn-link"
        href="javascript:void(0);"
        on:click="{() => showEditPlayerModal(data.player)}">
        <i class="fas fa-pencil-alt mr-1"></i>
        Düzenle
      </a>
      <a
        class="btn btn-outline-danger"
        data-target="#conformBanPlayer"
        data-toggle="modal"
        href="javascript:void(0);">
        <i class="fas fa-gavel mr-1"></i>
        Yasakla
      </a>
    </div>
  </div>

  <div class="row">
    <div class="col-lg-3">
      <div class="card">
        <div
          class="card-body d-flex flex-column justify-content-center
          align-items-center">
          <img
            alt="{data.player.username}"
            class="mb-3 rounded-circle animate__animated animate__zoomIn"
            width="64"
            height="64"
            src="https://minotar.net/avatar/{data.player.username}" />

          <h4 class="card-title">{data.player.username}</h4>
          <h6 class="text-muted">{data.player.email}</h6>
          {#if data.player.isBanned}
            <hr />
            <div class="badge badge-pill badge-danger d-block">
              <i class="fas fa-gavel mr-1"></i>
              Yasaklı
            </div>
          {/if}
          <hr />

          <ul class="list-inline my-0">
            <li class="list-inline-item">
              <div class="badge text-dark border text-capitalize">
                <a
                  href="{base}/players/permission/{data.player
                    .permission_group}">
                  {data.player.permission_group === "-"
                    ? "Oyuncu"
                    : data.player.permission_group}
                </a>
              </div>
            </li>
            <li class="list-inline-item">
              <div class="badge text-dark border">
                Kayıt: <Date time="{data.player.registerDate}" />
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
                {data.player.username} tarafından Son Talepler
              </h5>
            </div>
            <div class="col-6 text-right">
              <a href="{base}/tickets" class="btn btn-link bg-light btn-sm">
                Tüm Talepler
              </a>
            </div>
          </div>

          {#if data.ticketCount === 0}
            <div
              class="container text-center animate__animated animate__zoomIn">
              <i class="fas fa-ticket-alt fa-3x text-glass m-3"></i>
              <p class="text-gray">Burada içerik yok.</p>
            </div>
          {:else}
            {#each data.tickets as ticket, index (ticket)}
              <a
                href="{base}/tickets/ticket/{ticket.id}"
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
            page="{data.page}"
            totalPage="{data.ticketTotalPage}"
            on:firstPageClick="{() => reloadData(1)}"
            on:lastPageClick="{() => reloadData(data.ticketTotalPage)}"
            on:pageLinkClick="{(event) => reloadData(event.detail.page)}" />
        </div>
      </div>
    </div>
  </div>
</div>

<ConfirmBanPlayerModal />

<EditPlayerModal />

<AuthorizePlayerModal />

<script context="module">
  import ApiUtil from "$lib/api.util";
  import { showNetworkErrorOnCatch } from "$lib/store";

  async function loadData({ username, page, request, CSRFToken }) {
    return new Promise((resolve, reject) => {
      ApiUtil.post({
        path: "/api/panel/initPage/playerDetail",
        body: {
          username,
          page,
        },
        request,
        CSRFToken,
      }).then((body) => {
        if (body.result === "ok") {
          const data = body;

          data.username = username;
          data.page = parseInt(page);

          resolve(data);
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
          player: {
            username: "",
            isBanned: false,
            registerDate: 0,
            permission_group: "",
          },
          tickets: [],
          ticketCount: 0,
          ticketTotalPage: 1,
        },
      },
    };

    if (request.stuff.NETWORK_ERROR) {
      output.props.data.NETWORK_ERROR = true;

      return output;
    }

    await loadData({
      username: request.page.params.username,
      page: request.page.params.page || 1,
      request,
    })
      .then((data) => {
        output.props.data = { ...output.props.data, ...data };
      })
      .catch((body) => {
        if (body.error === "NOT_EXISTS" || body.error === "PAGE_NOT_FOUND")
          output = null;
      });

    return output;
  }
</script>

<script>
  import { goto } from "$app/navigation";
  import { base } from "$app/paths";
  import { session, page } from "$app/stores";

  import { getTitle } from "$lib/title.util";

  import ConfirmBanPlayerModal from "$lib/component/modals/ConfirmBanPlayerModal.svelte";
  import EditPlayerModal, {
    show as showEditPlayerModal,
    setCallback as setEditPlayerModalCallback,
  } from "$lib/component/modals/EditPlayerModal.svelte";
  import AuthorizePlayerModal, {
    show as showAuthorizePlayerModal,
    setCallback as setAuthorizePlayerModalCallback,
  } from "$lib/component/modals/AuthorizePlayerModal.svelte";

  import TicketStatus from "$lib/component/TicketStatus.svelte";
  import Date from "$lib/component/Date.svelte";
  import Pagination from "$lib/component/Pagination.svelte";

  export let data;

  if (data.NETWORK_ERROR) {
    showNetworkErrorOnCatch((resolve, reject) => {
      loadData({
        username: $page.params.username,
        page: $page.params.page || 1,
        CSRFToken: $session.CSRFToken,
      })
        .then((loadedData) => {
          data = loadedData;

          resolve();
        })
        .catch((body) => {
          if (body.error === "NOT_EXISTS" || body.error === "PAGE_NOT_FOUND") {
            goto(base + "/error-404");

            resolve();
          } else {
            reject();
          }
        });
    }, true);
  }

  function reloadData(page = data.page) {
    showNetworkErrorOnCatch((resolve, reject) => {
      loadData({
        username: data.player.username,
        page,
        CSRFToken: $session.CSRFToken,
      })
        .then((loadedData) => {
          resolve();

          if (page !== data.page) {
            goto(base + "/players/player/" + data.player.username + "/" + page);
          } else {
            data = loadedData;
          }
        })
        .catch((body) => {
          if (body.error === "NOT_EXISTS" || body.error === "PAGE_NOT_FOUND") {
            resolve();

            reloadData(page - 1);
          } else {
            reject();
          }
        });
    });
  }

  setAuthorizePlayerModalCallback((newPlayer) => {
    data.player.permission_group = newPlayer.permission_group;
  });

  setEditPlayerModalCallback((newPlayer) => {
    if (data.player.username !== newPlayer.username) {
      goto(base + "/players/player/" + newPlayer.username + "/" + data.page);

      return;
    }

    data.player = newPlayer;
  });
</script>
