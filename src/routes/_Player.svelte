<!-- Player Detail Page -->

<div class="container">
  <!-- Action Menu -->
  <div class="row mb-3">
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
        on:click="{() => showAuthorizePlayerModal(data.player)}"
      >
        <i class="fas fa-user-circle mr-1"></i>
        Yetkilendir
      </a>
      <a
        class="btn btn-link"
        href="javascript:void(0);"
        on:click="{() => showEditPlayerModal(data.player)}"
      >
        <i class="fas fa-pencil-alt mr-1"></i>
        Düzenle
      </a>
      <a
        class="btn btn-outline-danger"
        data-target="#conformBanPlayer"
        data-toggle="modal"
        href="javascript:void(0);"
      >
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
          align-items-center"
        >
          <img
            alt="{data.player.username}"
            class="mb-3 rounded-circle"
            width="64"
            height="64"
            src="https://minotar.net/avatar/{data.player.username}"
          />

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
                {data.player.permission_group === "-"
                  ? "Oyuncu"
                  : data.player.permission_group}
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
            <div class="container text-center">
              <i class="fas fa-ticket-alt fa-3x text-glass m-3"></i>
              <p class="text-gray">Burada içerik yok.</p>
            </div>
          {:else}
            {#each data.tickets as ticket, index (ticket)}
              <a
                href="{base}/tickets/ticket/{ticket.id}"
                class="list-group-item list-group-item-action rounded d-flex flex-row"
              >
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
            on:pageLinkClick="{(event) => reloadData(event.detail.page)}"
          />
        </div>
      </div>
    </div>
  </div>
</div>

<ConfirmBanPlayerModal />

<EditPlayerModal />

<AuthorizePlayerModal />

<script context="module">
  import { browser } from "$app/env";

  import ApiUtil from "$lib/api.util";
  import { showNetworkErrorOnCatch } from "$lib/store";

  let refreshable = false;

  async function loadData(username, page) {
    return new Promise((resolve, reject) => {
      ApiUtil.post("panel/initPage/playerDetail", {
        username,
        page,
      })
        .then((response) => {
          if (response.data.result === "ok") {
            const data = response.data;

            resolve(data);
          } else if (response.data.result === "error") {
            const errorCode = response.data.error;

            reject(errorCode, response.data);
          }
        })
        .catch((e) => {
          console.log(e);
        });
    });
  }

  async function initData(username, page) {
    return new Promise((resolvePromise, rejectPromise) => {
      showNetworkErrorOnCatch((resolve, reject) => {
        loadData(username, page)
          .then((data) => {
            data.page = page;

            resolvePromise(data);
          })
          .catch((errorCode, data) => {
            if (errorCode === "NOT_EXISTS" || errorCode === "PAGE_NOT_FOUND") {
              resolve();
            } else {
              reject();
            }

            rejectPromise(errorCode, data);
          });
      });
    });
  }

  /**
   * @type {import('@sveltejs/kit').Load}
   */
  export async function load({ page, session }) {
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

    if (
      page.path === session.loadedPath &&
      !refreshable &&
      !!session.data &&
      (session.data.error === "NOT_EXISTS" ||
        session.data.error === "PAGE_NOT_FOUND")
    )
      return null;

    if (browser && (page.path !== session.loadedPath || refreshable)) {
      // from another page
      await initData(
        page.params.username,
        !!page.params.page ? parseInt(page.params.page) : 1
      )
        .then((data) => {
          output.props.data = data;
        })
        .catch((errorCode) => {
          if (
            !!errorCode &&
            (errorCode === "NOT_EXISTS" || errorCode === "PAGE_NOT_FOUND")
          ) {
            return null;
          }
        });
    }

    if (page.path === session.loadedPath && !refreshable) {
      if (browser) refreshable = true;

      output.props.data = session.data;
      output.props.data.page = !!page.params.page
        ? parseInt(page.params.page)
        : 1;
    }

    return output;
  }
</script>

<script>
  import { goto } from "$app/navigation";
  import { base } from "$app/paths";

  import ConfirmBanPlayerModal from "../components/modals/ConfirmBanPlayerModal.svelte";
  import EditPlayerModal, {
    show as showEditPlayerModal,
    setCallback as setEditPlayerModalCallback,
  } from "../components/modals/EditPlayerModal.svelte";
  import AuthorizePlayerModal, {
    show as showAuthorizePlayerModal,
    setCallback as setAuthorizePlayerModalCallback,
  } from "../components/modals/AuthorizePlayerModal.svelte";

  import TicketStatus from "../components/TicketStatus.svelte";
  import Date from "../components/Date.svelte";
  import Pagination from "../components/Pagination.svelte";

  export let data;

  function reloadData(page = data.page) {
    showNetworkErrorOnCatch((resolve, reject) => {
      loadData(data.player.username, page)
        .then((loadedData) => {
          resolve();

          if (page !== data.page) {
            goto(base + "/players/player/" + data.player.username + "/" + page);
          } else {
            data = loadedData;
            data.page = page;
          }
        })
        .catch((errorCode) => {
          if (!!errorCode && errorCode === "PAGE_NOT_FOUND") {
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
