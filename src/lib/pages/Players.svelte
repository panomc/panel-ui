<!-- All Players Page -->
<div class="container">
  <!-- Action Menu -->
  <div class="row mb-3 animate__animated animate__slideInUp">
    <div class="col-auto">
      <a class="btn btn-link" role="button" href="{base}/players/perm-groups">
        <i class="fas fa-user-circle me-2"></i>
        Yetki Grupları
      </a>
    </div>
  </div>

  <!-- All Players -->
  <div class="card">
    <div class="card-body">
      <div class="row justify-content-between">
        <div class="col-md-auto col-12 text-md-left text-center">
          <h5 class="card-title">
            {data.playerCount}
            {data.pageType === PageTypes.HAS_PERM
              ? "Yetkili"
              : data.pageType === PageTypes.BANNED
              ? "Yasaklı"
              : ""} Oyuncu
          </h5>
        </div>
        <div class="col-md-auto col-12 text-md-right text-center">
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
      {#if data.playerCount === 0}
        <div class="container text-center animate__animated animate__zoomIn">
          <i class="fas fa-users fa-3x m-3 text-dark text-opacity-25"></i>
          <p class="text-gray">Burada içerik yok.</p>
        </div>
      {:else}
        <!-- Players Table -->
        <div class="table-responsive">
          <table class="table table-borderless table-hover mb-0">
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
                <PlayerRow
                  player="{player}"
                  on:showAuthorizePlayerModalClick="{(event) =>
                    onShowAuthorizePlayerModalClick(event.detail.player)}"
                  on:showEditPlayerModalClick="{(event) =>
                    onShowEditPlayerModalClick(event.detail.player)}"
                  on:showBanPlayerModalClick="{(event) =>
                    showBanPlayerModalClick(event.detail.player)}"
                  on:showUnbanPlayerModalClick="{(event) =>
                    showUnbanPlayerModalClick(event.detail.player)}" />
              {/each}
            </tbody>
          </table>
        </div>
      {/if}

      <!-- Pagination -->
      <Pagination
        page="{data.page}"
        totalPage="{data.totalPage}"
        on:firstPageClick="{() => reloadData(1)}"
        on:lastPageClick="{() => reloadData(data.totalPage)}"
        on:pageLinkClick="{(event) => reloadData(event.detail.page)}" />
    </div>
  </div>
</div>

<script context="module">
  import { error } from "@sveltejs/kit";

  import ApiUtil from "$lib/api.util";
  import { showNetworkErrorOnCatch } from "$lib/Store";

  export const PageTypes = Object.freeze({
    ALL: "all",
    HAS_PERM: "hasPerm",
    BANNED: "banned",
  });

  export const DefaultPageType = PageTypes.ALL;

  async function loadData({ page, pageType, request }) {
    return new Promise((resolve, reject) => {
      ApiUtil.get({
        path: `/api/panel/players?page=${page}&status=${pageType}`,
        body: {
          page: parseInt(page),
        },
        request,
      }).then((body) => {
        if (body.result === "ok") {
          const data = body;

          data.page = parseInt(page);
          data.pageType = pageType;

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
  export async function load(event, pageType = DefaultPageType) {
    const { parent } = event;
    const parentData = await parent();

    let data = {
      playerCount: 0,
      players: [],
      totalPage: 1,
      page: 1,
      pageType,
    };

    if (parentData.stuff.NETWORK_ERROR) {
      return data;
    }

    await loadData({ page: event.params.page || 1, pageType, request: event })
      .then((body) => {
        data = { ...data, ...body };
      })
      .catch((body) => {
        if (body.error) {
          if (body.error === "PAGE_NOT_FOUND") {
            throw error(404, body.error);
          }

          throw error(500, body.error);
        }
      });

    return data;
  }
</script>

<script>
  import { goto } from "$app/navigation";
  import { base } from "$app/paths";

  import { pageTitle } from "$lib/Store";

  import Pagination from "$lib/component/Pagination.svelte";

  import {
    show as showAuthorizePlayerModal,
    setCallback as setAuthorizePlayerModalCallback,
    onHide as onAuthorizePlayerModalHide,
  } from "$lib/component/modals/AuthorizePlayerModal.svelte";
  import {
    show as showEditPlayerModal,
    setCallback as setEditPlayerModalCallback,
    onHide as onEditPlayerModalHide,
  } from "$lib/component/modals/EditPlayerModal.svelte";
  import {
    show as showConfirmBanPlayerModal,
    setCallback as setConfirmBanPlayerModalCallback,
    onHide as onConfirmBanPlayerModalHide,
  } from "$lib/component/modals/ConfirmBanPlayerModal.svelte";
  import {
    show as showUnbanPlayerModal,
    setCallback as setUnbanPlayerModalCallback,
    onHide as onUnbanPlayerModalHide,
  } from "$lib/component/modals/UnbanPlayerModal.svelte";

  import PlayerRow from "$lib/component/PlayerRow.svelte";

  export let data;

  pageTitle.set(
    (data.pageType === PageTypes.HAS_PERM
      ? "Yetkili" + " "
      : data.pageType === PageTypes.BANNED
      ? "Yasaklı" + " "
      : "") + "Oyuncular"
  );

  function reloadData(page = data.page, pageType = data.pageType) {
    showNetworkErrorOnCatch((resolve, reject) => {
      loadData({ page, pageType })
        .then((loadedData) => {
          resolve();

          if (page !== data.page) {
            goto(base + "/players/" + data.pageType + "/" + page);
          } else {
            data = loadedData;
          }
        })
        .catch((body) => {
          if (body.error === "PAGE_NOT_FOUND") {
            resolve();

            reloadData(page - 1);
          } else {
            reject();
          }
        });
    });
  }

  function onShowAuthorizePlayerModalClick(player) {
    data.players[data.players.indexOf(player)].selected = true;

    showAuthorizePlayerModal(player);
  }

  function onShowEditPlayerModalClick(player) {
    data.players[data.players.indexOf(player)].selected = true;

    showEditPlayerModal(player);
  }

  function showBanPlayerModalClick(player) {
    data.players[data.players.indexOf(player)].selected = true;

    showConfirmBanPlayerModal(player);
  }

  function showUnbanPlayerModalClick(player) {
    data.players[data.players.indexOf(player)].selected = true;

    showUnbanPlayerModal(player);
  }

  setAuthorizePlayerModalCallback((newPlayer) => {
    data.players.forEach((player) => {
      if (player.id === newPlayer.id) {
        player.permissionGroup = newPlayer.permissionGroup;
        player.selected = false;
      }
    });

    data.players = data.players;
  });

  setEditPlayerModalCallback((newPlayer) => {
    data.players.forEach((player) => {
      if (player.id === newPlayer.id) {
        player.username = newPlayer.username;
        player.email = newPlayer.email;
        player.selected = false;
      }
    });

    data.players = data.players;
  });

  onAuthorizePlayerModalHide((newPlayer) => {
    data.players.forEach((player) => {
      if (player.id === newPlayer.id) {
        player.selected = false;
      }
    });

    data.players = data.players;
  });

  onEditPlayerModalHide((newPlayer) => {
    data.players.forEach((player) => {
      if (player.id === newPlayer.id) {
        player.selected = false;
      }
    });

    data.players = data.players;
  });

  onConfirmBanPlayerModalHide((newPlayer) => {
    data.players.forEach((player) => {
      if (player.id === newPlayer.id) {
        player.selected = false;
      }
    });

    data.players = data.players;
  });

  onUnbanPlayerModalHide((newPlayer) => {
    data.players.forEach((player) => {
      if (player.id === newPlayer.id) {
        player.selected = false;
      }
    });

    data.players = data.players;
  });

  setConfirmBanPlayerModalCallback((newPlayer) => {
    data.players.forEach((player) => {
      if (player.id === newPlayer.id) {
        player.selected = false;
      }
    });

    data.players = data.players;

    reloadData();
  });

  setUnbanPlayerModalCallback((newPlayer) => {
    data.players.forEach((player) => {
      if (player.id === newPlayer.id) {
        player.selected = false;
      }
    });

    data.players = data.players;

    reloadData();
  });
</script>
