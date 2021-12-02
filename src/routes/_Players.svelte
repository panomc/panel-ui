<!-- All Players Page -->
<div class="container">
  <!-- Action Menu -->
  <div class="row mb-3">
    <div class="col-auto">
      <a class="btn btn-link" role="button" href="{base}/players/permissions">
        <i class="fas fa-user-circle mr-1"></i>
        Yetkiler
      </a>
    </div>
  </div>

  <!-- All Players -->
  <div class="card">
    <div class="card-body">
      <div class="row justify-content-between">
        <div class="col-md-6 col-12 text-md-left text-center">
          <h5 class="card-title">
            {data.players_count}
            {data.pageType === PageTypes.HAS_PERM
              ? "Yetkili"
              : data.pageType === PageTypes.BANNED
              ? "Yasaklı"
              : ""} Oyuncu
          </h5>
        </div>
        <div class="col-md-6 col-12 text-md-right text-center">
          <div class="btn-group">
            <a
              class:active="{data.pageType === PageTypes.ALL}"
              class="btn btn-sm btn-outline-light btn-link"
              role="button"
              href="{base}/players/all">
              Tümü
            </a>
            <a
              class:active="{data.pageType === PageTypes.HAS_PERM}"
              class="btn btn-sm btn-outline-light btn-link"
              role="button"
              href="{base}/players/hasPerm">
              Yetkililer
            </a>
            <a
              class:active="{data.pageType === PageTypes.BANNED}"
              class="btn btn-sm btn-outline-light btn-link text-danger"
              role="button"
              href="{base}/players/banned">
              Yasaklı
            </a>
          </div>
        </div>
      </div>

      <!-- No Players -->
      {#if data.players_count === 0}
        <div class="container text-center animate__animated animate__headShake animate__slower">
          <i class="fas fa-users fa-3x text-glass m-3"></i>
          <p class="text-gray">Burada içerik yok.</p>
        </div>
      {:else}
        <!-- Players Table -->
        <div class="table-responsive animate__animated animate__zoomIn animate__faster">
          <table class="table mb-0">
            <thead>
              <tr>
                <th class="align-middle text-nowrap" scope="col"></th>
                <th class="align-middle text-nowrap" scope="col">İsim</th>
                <th class="align-middle text-nowrap" scope="col">Yetki</th>
                <th class="align-middle text-nowrap" scope="col">Durum</th>
                <th class="align-middle text-nowrap" scope="col">Son Oturum</th>
                <th class="align-middle text-nowrap" scope="col">Kayıt</th>
              </tr>
            </thead>
            <tbody>
              {#each data.players as player, index (player)}
                <tr>
                  <th class="min-w-50px" scope="row">
                    <div class="dropdown position-absolute">
                      <a
                        class="btn btn-sm py-0"
                        aria-expanded="false"
                        aria-haspopup="true"
                        data-toggle="dropdown"
                        href="javascript:void(0);"
                        id="playerAction"
                        title="Eylemler">
                        <i class="fas fa-ellipsis-v"></i>
                      </a>
                      <div
                        aria-labelledby="playerAction"
                        class="dropdown-menu dropdown-menu-right animate__animated animate__zoomIn animate__fast">
                        <a
                          class="dropdown-item"
                          href="javascript:void(0);"
                          on:click="{() => showAuthorizePlayerModal(player)}">
                          <i class="fas fa-user-circle mr-1 text-primary"></i>
                          Yetkilendir
                        </a>
                        <a
                          class="dropdown-item"
                          href="javascript:void(0);"
                          on:click="{() => showEditPlayerModal(player)}">
                          <i class="fas fa-pencil-alt mr-1 text-primary"></i>
                          Düzenle
                        </a>
                        <a
                          class="dropdown-item"
                          data-target="#conformBanTickets"
                          data-toggle="modal"
                          href="javascript:void(0);">
                          <i class="fas fa-gavel mr-1 text-danger"></i>
                          Yasakla
                        </a>
                      </div>
                    </div>
                  </th>
                  <td class="min-w-200px align-middle text-nowrap">
                    <a
                      title="Oyuncu Profiline Git"
                      href="{base}/players/player/{player.username}">
                      <img
                        alt="{player.username}"
                        class="rounded-circle border mr-3"
                        height="32"
                        src="https://minotar.net/avatar/{player.username}"
                        width="32" />
                      {player.username}
                    </a>
                  </td>
                  <td class="align-middle text-nowrap text-capitalize">
                    <a
                      href="{base}/players/permission/{player.permission_group}">
                      {player.permission_group === "-"
                        ? "Oyuncu"
                        : player.permission_group}
                    </a>
                    <i
                      aria-hidden="true"
                      class="fa fa-times text-danger fa-fw"
                      use:tooltip="{[
                        'Talepleri Yasaklı',
                        { placement: 'top' },
                      ]}"></i>
                  </td>
                  <td class="align-middle text-nowrap">
                    <span
                      class="badge badge-pill badge-lightsecondary text-success"
                      use:tooltip="{['Sitede', { placement: 'top' }]}">
                      <i aria-hidden="true" class="fa fa-globe fa-fw"></i>
                      <span class="d-md-inline d-none ml-1">Çevrimiçi</span>
                    </span>
                  </td>
                  <td class="align-middle text-nowrap">10 dakika önce</td>
                  <td class="align-middle text-nowrap">
                    <Date time="{player.register_date}" />
                  </td>
                </tr>
              {/each}
            </tbody>
          </table>
        </div>
      {/if}

      <!-- Pagination -->
      <Pagination
        page="{data.page}"
        totalPage="{data.total_page}"
        on:firstPageClick="{() => reloadData(1)}"
        on:lastPageClick="{() => reloadData(data.total_page)}"
        on:pageLinkClick="{(event) => reloadData(event.detail.page)}" />
    </div>
  </div>
</div>

<EditPlayerModal />
<AuthorizePlayerModal />

<script context="module">
  import { browser } from "$app/env";

  import ApiUtil from "$lib/api.util";
  import { showNetworkErrorOnCatch } from "$lib/store";

  let refreshable = false;

  export const PageTypes = Object.freeze({
    ALL: "all",
    HAS_PERM: "hasPerm",
    BANNED: "banned",
  });

  export const DefaultPageType = PageTypes.ALL;

  export function getStatusFromPageType(pageType) {
    return pageType === PageTypes.ALL
      ? 1
      : pageType === PageTypes.HAS_PERM
      ? 2
      : 0;
  }

  async function loadData(page, pageType) {
    return new Promise((resolve, reject) => {
      ApiUtil.post("panel/initPage/playersPage", {
        page: parseInt(page),
        page_type: getStatusFromPageType(pageType),
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

  async function initData(page, pageType) {
    return new Promise((resolvePromise, rejectPromise) => {
      showNetworkErrorOnCatch((resolve, reject) => {
        loadData(page, pageType)
          .then((data) => {
            data.page = parseInt(page);
            data.pageType = pageType;

            resolvePromise(data);
          })
          .catch((errorCode, data) => {
            if (errorCode === "PAGE_NOT_FOUND") {
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
  export async function load({ page, session }, pageType = DefaultPageType) {
    let output = {
      props: {
        data: {
          players_count: 0,
          players: [],
          total_page: 1,
          page: 1,
        },
      },
    };

    if (
      page.path === session.loadedPath &&
      !refreshable &&
      !!session.data &&
      session.data.error === "PAGE_NOT_FOUND"
    )
      return null;

    if (browser && (page.path !== session.loadedPath || refreshable)) {
      // from another page
      await initData(
        !!page.params.page ? parseInt(page.params.page) : 1,
        pageType
      )
        .then((data) => {
          output.props.data = {...output.props.data, ...data};
        })
        .catch((errorCode, data) => {
          if (!!errorCode && errorCode === "PAGE_NOT_FOUND") {
            return null;
          }
        });
    }

    if (page.path === session.loadedPath && !refreshable) {
      if (browser) refreshable = true;

      output.props.data = {...output.props.data, ...session.data};

      output.props.data.page = !!page.params.page
        ? parseInt(page.params.page)
        : 1;
      output.props.data.pageType = pageType;
    }

    return output;
  }
</script>

<script>
  import { goto } from "$app/navigation";
  import { base } from "$app/paths";

  import tooltip from "$lib/tooltip.util";

  import Date from "../components/Date.svelte";
  import Pagination from "../components/Pagination.svelte";

  import AuthorizePlayerModal, {
    show as showAuthorizePlayerModal,
    setCallback as setAuthorizePlayerModalCallback,
  } from "../components/modals/AuthorizePlayerModal.svelte";
  import EditPlayerModal, {
    show as showEditPlayerModal,
    setCallback as setEditPlayerModalCallback,
  } from "../components/modals/EditPlayerModal.svelte";

  export let data;

  function reloadData(page = data.page, pageType = data.pageType) {
    showNetworkErrorOnCatch((resolve, reject) => {
      loadData(page, pageType)
        .then((loadedData) => {
          resolve();

          if (page !== data.page) {
            goto(base + "/players/" + data.pageType + "/" + page);
          } else {
            data = loadedData;

            data.page = page;
            data.pageType = pageType;
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
    data.players.forEach((player) => {
      if (player.id === newPlayer.id)
        player.permission_group = newPlayer.permission_group;
    });

    data.players = data.players;
  });

  setEditPlayerModalCallback((newPlayer) => {
    data.players.forEach((player) => {
      if (player.id === newPlayer.id) {
        player.username = newPlayer.username;
        player.email = newPlayer.email;
      }
    });

    data.players = data.players;
  });
</script>
