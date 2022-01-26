<!-- Player Detail Page -->
<div class="container">
  <!-- Action Menu -->
  <div
    class="row justify-content-between mb-3 animate__animated animate__slideInUp">
    <div class="col-auto">
      <a class="btn btn-link" role="button" href="{base}/players">
        <i class="fas fa-arrow-left mr-1"></i>
        Oyuncular
      </a>
    </div>
    <div class="col-auto">
      <a
        class="btn btn-link"
        use:tooltip="{[
          'Oyuncu e-postasına bir doğrulama bağlantısı gönder',
          { placement: 'bottom' },
        ]}"
        href="#">
        <i class="fas fa-envelope"></i>
        <span class="ml-1 d-lg-inline d-none">Doğrula</span>
      </a>
      <a
        class="btn btn-link"
        href="#"
        on:click="{() =>
          showAuthorizePlayerModal(data.player, $session.CSRFToken)}">
        <i class="fas fa-user-circle"></i>
        <span class="ml-1 d-lg-inline d-none">Yetkilendir</span>
      </a>
      <a
        class="btn btn-link"
        href="#"
        on:click="{() => showEditPlayerModal(data.player)}">
        <i class="fas fa-pencil-alt"></i>
        <span class="ml-1 d-lg-inline d-none">Düzenle</span>
      </a>
      <a
        class="btn btn-outline-danger"
        data-target="#conformBanPlayer"
        data-toggle="modal"
        href="#">
        <i class="fas fa-gavel"></i>
        <span class="ml-1 d-lg-inline d-none">Yasakla</span>
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
            width="128"
            height="128"
            src="https://minotar.net/avatar/{data.player.username}" />

          <h4 class="card-title">{data.player.username}</h4>
          <h6 class="text-muted">{data.player.email}</h6>
          <hr />

          <ul class="list-inline mb-0">
            <li class="list-inline-item mb-2">
              {#if data.player.isBanned}
                <div class="badge bg-danger text-white">
                  <i class="fas fa-gavel mr-1"></i>
                  Yasaklı
                </div>
              {/if}
              <div
                class="badge bg-lightsecondary text-success"
                use:tooltip="{['Sitede', { placement: 'top' }]}">
                <i aria-hidden="true" class="fa fa-globe fa-fw"></i>
                <span class="d-md-inline d-none ml-1">Çevrimiçi</span>
              </div>
              <div class="badge text-dark border">
                <a
                  href="{base}/players/permission/{data.player
                    .permission_group}">
                  {data.player.permission_group === "-"
                    ? "Oyuncu"
                    : data.player.permission_group}
                </a>
              </div>
            </li>
            <li class="list-inline-item mb-2">
              <div class="badge text-dark border">Doğrulandı</div>
              <div class="badge text-dark border">Doğrulannadı</div>
            </li>
            <li class="list-inline-item mb-2">
              <div class="badge text-dark border">
                <Date time="{data.player.registerDate}" />
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
          <div class="row justify-content-between mb-3">
            <div class="col-auto">
              <h5 class="card-title">Son Talepler</h5>
            </div>
            <div class="col-auto">
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

<script context="module">
  import ApiUtil from "$lib/api.util";
  import { pageTitle, showNetworkErrorOnCatch } from "$lib/store";

  async function loadData({ username, page, request, CSRFToken }) {
    return new Promise((resolve, reject) => {
      ApiUtil.post({
        path: "/api/panel/initPage/playerDetail",
        body: {
          username,
          page: parseInt(page),
        },
        request,
        CSRFToken,
      }).then((body) => {
        if (body.result === "ok") {
          const data = body;

          data.username = username;
          data.page = parseInt(page);

          pageTitle.set(username);

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

  import tooltip from "$lib/tooltip.util";

  import {
    show as showEditPlayerModal,
    setCallback as setEditPlayerModalCallback,
  } from "$lib/component/modals/EditPlayerModal.svelte";
  import {
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
