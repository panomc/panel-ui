<!-- Player Detail Page -->
<div class="container">
  <!-- Action Menu -->
  <div class="row justify-content-between mb-3">
    <div class="col-auto">
      <a class="btn btn-link" role="button" href="{base}/players">
        <i class="fas fa-arrow-left me-2"></i>
        Oyuncular
      </a>
    </div>
    <div class="col-auto">
      <a
        class="btn btn-link link-danger"
        href="javascript:void(0);"
        use:tooltip="{['Sil', { placement: 'bottom' }]}"
        on:click="{() => showConfirmBanPlayerModal(data.player)}">
        <i class="fas fa-trash"></i>
      </a>
      {#if data.player.isBanned}
        <a
          class="btn btn-link link-danger"
          href="javascript:void(0);"
          use:tooltip="{['Yasağı Kaldır', { placement: 'bottom' }]}"
          on:click="{() => showUnbanPlayerModal(data.player)}">
          <i class="fas fa-gavel"></i>
        </a>
      {:else}
        <a
          class="btn btn-link link-danger"
          href="javascript:void(0);"
          use:tooltip="{['Yasakla', { placement: 'bottom' }]}"
          on:click="{() => showConfirmBanPlayerModal(data.player)}">
          <i class="fas fa-gavel"></i>
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
        </a>
      {/if}

      <!-- on:click="{() => showAuthorizePlayerModal(data.player)}" -->
      <div class="dropdown d-inline-block">
        <a
          class="btn btn-link"
          data-bs-toggle="dropdown"
          href="javascript:void(0);"
          use:tooltip="{['Yetkilendir', { placement: 'bottom' }]}">
          <i class="fas fa-user-circle"></i>
        </a>

        <div class="dropdown-menu dropdown-menu-end animate__animated animate__zoomInUp">
          <h6 class="dropdown-header">Yetkilendir</h6>
          <!-- Perm Group List -->
          <a class="dropdown-item" href="javascript:void(0);"> Yetki </a>

          <!-- Placeholder -->
          <div class="dropdown-item placeholder-glow">
            <span class="placeholder col-12"></span>
          </div>
          <div class="dropdown-item placeholder-glow">
            <span class="placeholder col-12"></span>
          </div>
          <div class="dropdown-item placeholder-glow">
            <span class="placeholder col-12"></span>
          </div>
          <div class="dropdown-item placeholder-glow">
            <span class="placeholder col-12"></span>
          </div>
        </div>
      </div>

      <a
        class="btn btn-primary"
        href="javascript:void(0);"
        on:click="{() => showEditPlayerModal(data.player)}">
        <i class="fas fa-pencil-alt me-2"></i> Düzenle
      </a>
    </div>
  </div>

  <div class="row">
    <div class="col-lg-3">
      <div class="card mb-3">
        <div
          class="card-body d-flex flex-column justify-content-center
          align-items-center">
          <img
            alt="{data.player.username}"
            class="mb-3 rounded-circle animate__animated animate__zoomIn"
            width="128"
            height="128"
            class:border="{isOnline}"
            class:border-5="{isOnline}"
            class:border-secondary="{isOnline}"
            src="https://crafthead.net/avatar/{data.player.username}"
            use:tooltip="{[
              isOnline
                ? (data.player.inGame ? 'Oyunda' : 'Sitede') + ' Çevrimiçi'
                : getOfflineRelativeDateText(checkTime),
              { placement: 'bottom' },
            ]}" />

          <h3 class="card-title">{data.player.username}</h3>
          <h6 class="text-muted">{data.player.email}</h6>

          {#if data.player.isBanned}
            <div class="text-danger">Yasaklı</div>
          {:else}
            <a
              title="Filtrele"
              href="{base}/players/by-perm-group/{data.player.permissionGroup}">
              {data.player.permissionGroup === "-"
                ? "Oyuncu"
                : data.player.permissionGroup}
            </a>
          {/if}
        </div>
      </div>
    </div>
    <div class="col-lg-9">
      <!-- User's Tickets -->
      <div class="card mb-3">
        <div class="card-body">
          <h5 class="card-title">Son Talepler</h5>

          {#if data.ticketCount === 0}
            <NoContent />
          {:else}
            <table class="table table-borderless table-hover mb-0">
              {#each data.tickets as ticket, index (ticket)}
                <tbody>
                  <tr>
                    <td class="align-middle text-nowrap">
                      <a
                        href="{base}/tickets/ticket/{ticket.id}"
                        title="Görüntüle">#{ticket.id} {ticket.title}</a>
                    </td>
                    <td class="align-middle text-nowrap">
                      <a
                        title="Filtrele"
                        href="/tickets/category/{ticket.category.url}">
                        {ticket.category.title === "-"
                          ? "Kategorisiz"
                          : ticket.category.title}
                      </a>
                    </td>
                    <td class="align-middle text-nowrap">
                      <TicketStatusBadge status="{ticket.status}" />
                    </td>
                    <td class="align-middle text-nowrap"
                      ><span><DateComponent time="{ticket.lastUpdate}" /></span
                      ></td>
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
      <div class="card">
        <div class="card-body">
          <h5 class="card-title">İstatistikler</h5>
          <table class="table table-borderless mb-0">
            <tbody>
              <tr>
                <td>E-posta</td>
                <td>
                  {#if data.player.isEmailVerified}
                    Doğrulandı
                  {:else}
                    Doğrulanmadı
                  {/if}
                </td>
              </tr>
              <tr>
                <td>Son Giriş</td>
                <td><DateComponent time="{data.player.lastLoginDate}" /></td>
              </tr>
              <tr>
                <td>Kayıt</td>
                <td><DateComponent time="{data.player.registerDate}" /></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</div>

<script context="module">
  import ApiUtil from "$lib/api.util";
  import { pageTitle, showNetworkErrorOnCatch } from "$lib/Store";
  import { error } from "@sveltejs/kit";

  async function loadData({ username, page, request }) {
    return new Promise((resolve, reject) => {
      ApiUtil.get({
        path: `/api/panel/players/${username}?page=${page}`,
        request,
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
    const parentData = await parent();

    let data = {
      player: {
        username: "",
        isBanned: false,
        registerDate: 0,
        lastLoginDate: 0,
        permissionGroup: "",
        lastActivityTime: 0,
        inGame: false,
      },
      tickets: [],
      ticketCount: 0,
      ticketTotalPage: 1,
    };

    if (parentData.stuff.NETWORK_ERROR) {
      return data;
    }

    await loadData({
      username: event.params.username,
      page: event.params.page || 1,
      request: event,
    })
      .then((body) => {
        data = { ...data, ...body };
      })
      .catch((body) => {
        if (body.error) {
          if (body.error === "NOT_EXISTS" || body.error === "PAGE_NOT_FOUND") {
            throw error(404, body.error);
          }

          throw error(500, body.error);
        }
      });

    return data;
  }
</script>

<script>
  import { formatRelative } from "date-fns";
  import { onDestroy, onMount } from "svelte";

  import { goto } from "$app/navigation";
  import { base } from "$app/paths";

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
  import {
    show as showUnbanPlayerModal,
    setCallback as setUnbanPlayerModalCallback,
  } from "$lib/component/modals/UnbanPlayerModal.svelte";

  import TicketStatusBadge from "$lib/component/badges/TicketStatusBadge.svelte";
  import DateComponent from "$lib/component/Date.svelte";
  import Pagination from "$lib/component/Pagination.svelte";
  import { show as showToast } from "$lib/component/ToastContainer.svelte";

  import VerificationEmailSentSuccessfulToast from "$lib/component/toasts/VerificationEmailSentSuccessfulToast.svelte";
  import VerificationEmailSentErrorToast from "$lib/component/toasts/VerificationEmailSentErrorToast.svelte";

  import NoContent from "$lib/component/NoContent.svelte";

  export let data;

  let sendingVerificationMail;

  let checkTime = 0;
  let interval;

  $: isOnline =
    data.player.lastActivityTime > Date.now() - 5 * 60 * 1000 ||
    data.player.inGame;

  function reloadData(page = data.page) {
    showNetworkErrorOnCatch((resolve, reject) => {
      loadData({
        username: data.player.username,
        page,
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
        path: `/api/panel/players/${data.player.username}/verificationMail`,
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
    data.player.isBanned = true;
  });

  setUnbanPlayerModalCallback(() => {
    data.player.isBanned = false;
  });

  function getOfflineRelativeDateText(checkTime) {
    return formatRelative(
      new Date(parseInt(data.player.lastActivityTime)),
      new Date()
    ).capitalize();
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
