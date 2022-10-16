<!-- Player Detail Page -->
<div class="container">
  <!-- Action Menu -->
  <div
    class="row justify-content-between mb-3 animate__animated animate__slideInUp">
    <div class="col-auto">
      <a class="btn btn-link" role="button" href="{base}/players">
        <i class="fas fa-arrow-left me-2"></i>
        Oyuncular
      </a>
    </div>
    <div class="col-auto">
      {#if !data.player.isBanned}
        <a
          class="btn btn-link link-danger"
          href="javascript:void(0);"
          on:click="{() => showConfirmBanPlayerModal(data.player)}">
          <i class="fas fa-gavel"></i>
          <span class="ms-2 d-lg-inline d-none">Yasakla</span>
        </a>
      {/if}
      {#if !data.player.isEmailVerified}
        <a
          class="btn btn-link"
          use:tooltip="{[
            'Oyuncu e-postasına bir doğrulama bağlantısı gönder',
            { placement: 'bottom' },
          ]}"
          href="javascript:void(0);"
          on:click="{sendVerification}"
          class:disabled="{sendingVerificationMail}">
          <i class="fas fa-envelope"></i>
          <span class="ms-2 d-lg-inline d-none">Doğrula</span>
        </a>
      {/if}
      <a
        class="btn btn-link"
        href="javascript:void(0);"
        on:click="{() =>
          showAuthorizePlayerModal(data.player, $session.CSRFToken)}">
        <i class="fas fa-user-circle"></i>
        <span class="ms-2 d-lg-inline d-none">Yetkilendir</span>
      </a>
      <a
        class="btn btn-primary"
        href="javascript:void(0);"
        on:click="{() => showEditPlayerModal(data.player)}">
        <i class="fas fa-pencil-alt"></i>
        <span class="ms-2 d-lg-inline d-none">Düzenle</span>
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
            src="https://crafthead.net/avatar/{data.player.username}" />

          <h4 class="card-title">{data.player.username}</h4>
          <h6 class="text-muted">{data.player.email}</h6>

          <span
            class="badge bg-secondary rounded-pill"
            use:tooltip="{['Sitede', { placement: 'top' }]}">
            Çevrimiçi
          </span>
          <hr />

          <ul class="list-inline mb-0">
            <li class="list-inline-item mb-2">
              {#if data.player.isBanned}
                <div class="badge bg-danger text-white">Yasaklı</div>
              {/if}
              <div class="badge bg-light text-black">
                <a
                  href="{base}/players/permission/{data.player
                    .permissionGroup}">
                  {data.player.permissionGroup === "-"
                    ? "Oyuncu"
                    : data.player.permissionGroup}
                </a>
              </div>
            </li>
            <li class="list-inline-item mb-2">
              {#if data.player.isEmailVerified}
                <div class="badge bg-light text-black">Doğrulandı</div>
              {:else}
                <div class="badge bg-light text-black">Doğrulanmadı</div>
              {/if}
            </li>
            <li class="list-inline-item mb-2">
              <div class="badge bg-light text-black">
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
          <h5 class="card-title">Son Talepler</h5>

          {#if data.ticketCount === 0}
            <div
              class="container text-center animate__animated animate__zoomIn">
              <i class="fas fa-ticket-alt fa-3x text-dark text-opacity-25 m-3"
              ></i>
              <p class="text-gray">Burada içerik yok.</p>
            </div>
          {:else}
            <table class="table table-borderless table-hover mb-0">
              {#each data.tickets as ticket, index (ticket)}
                <tbody>
                  <tr>
                    <td class="align-middle text-nowrap">
                      <a
                        href="{base}/tickets/ticket/{ticket.id}"
                        title="Talebi Görüntüle">#{ticket.id} {ticket.title}</a>
                    </td>
                    <td class="align-middle text-nowrap">
                      <a
                        use:tooltip="{['Filtrele', { placement: 'bottom' }]}"
                        href="/tickets/category/{ticket.category.url}">
                        <span class="badge rounded-pill bg-light text-black">
                          {ticket.category.title === "-"
                            ? "Kategorisiz"
                            : ticket.category.title}</span>
                      </a>
                    </td>
                    <td class="align-middle text-nowrap">
                      <TicketStatus status="{ticket.status}" />
                    </td>
                    <td class="align-middle text-nowrap"
                      ><span><Date time="{ticket.lastUpdate}" /></span></td>
                  </tr>
                </tbody>
              {/each}
            </table>
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
  import { pageTitle, showNetworkErrorOnCatch } from "$lib/Store";

  async function loadData({ username, page, request, CSRFToken }) {
    return new Promise((resolve, reject) => {
      ApiUtil.get({
        path: `/api/panel/players/${username}?page=${page}`,
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
   * @type {import('@sveltejs/kit').PageLoad}
   */
  export async function load(event) {
    const { parent } = event;
    await parent();

    let data = {
      player: {
        username: "",
        isBanned: false,
        registerDate: 0,
        permissionGroup: "",
      },
      tickets: [],
      ticketCount: 0,
      ticketTotalPage: 1,
    };

    // if (event.stuff.NETWORK_ERROR) {
    //   output.props.data.NETWORK_ERROR = true;
    //
    //   return output;
    // }

    await loadData({
      username: event.params.username,
      page: event.params.page || 1,
      request: event,
    })
      .then((body) => {
        data = { ...data, ...body };
      })
      .catch((body) => {
        if (body.error === "NOT_EXISTS" || body.error === "PAGE_NOT_FOUND")
          data = null;
      });

    return data;
  }
</script>

<script>
  import { goto } from "$app/navigation";
  import { base } from "$app/paths";
  import { page } from "$app/stores";

  import tooltip from "$lib/tooltip.util";

  import {
    show as showEditPlayerModal,
    setCallback as setEditPlayerModalCallback,
  } from "$lib/component/modals/EditPlayerModal.svelte";
  import {
    show as showAuthorizePlayerModal,
    setCallback as setAuthorizePlayerModalCallback,
  } from "$lib/component/modals/AuthorizePlayerModal.svelte";
  import {
    show as showConfirmBanPlayerModal,
    setCallback as setConfirmBanPlayerModalCallback,
  } from "$lib/component/modals/ConfirmBanPlayerModal.svelte";

  import TicketStatus from "$lib/component/TicketStatus.svelte";
  import Date from "$lib/component/Date.svelte";
  import Pagination from "$lib/component/Pagination.svelte";
  import { session } from "$lib/Store.js";
  import { show as showToast } from "$lib/component/ToastContainer.svelte";

  import VerificationEmailSentSuccessfulToast from "$lib/component/toasts/VerificationEmailSentSuccessfulToast.svelte";
  import VerificationEmailSentErrorToast from "$lib/component/toasts/VerificationEmailSentErrorToast.svelte";

  export let data;
  let sendingVerificationMail;

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

  function sendVerification() {
    sendingVerificationMail = true;

    showNetworkErrorOnCatch((resolve, reject) => {
      ApiUtil.post({
        path: "/api/panel/sendValidationEmail",
        body: {
          username: data.player.username,
        },
      })
        .then((body) => {
          sendingVerificationMail = false;

          if (body.result === "ok") {
            showToast(VerificationEmailSentSuccessfulToast, {
              username: data.player.username,
            });

            return;
          }

          showToast(VerificationEmailSentErrorToast, {
            username: data.player.username,
            errorCode: body.error,
          });
        })
        .catch(() => {
          reject();
        });
    });
  }

  setAuthorizePlayerModalCallback((newPlayer) => {
    data.player.permissionGroup = newPlayer.permissionGroup;
  });

  setEditPlayerModalCallback((newPlayer) => {
    if (data.player.username !== newPlayer.username) {
      goto(base + "/players/player/" + newPlayer.username + "/" + data.page);

      return;
    }

    data.player = newPlayer;
  });

  setConfirmBanPlayerModalCallback(() => {
    data.player.isBanned = true
  });
</script>
