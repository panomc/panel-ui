<!-- All Players Page -->
<div class="container">
  <!-- Action Menu -->
  <PageActions>
    <a class="btn btn-link" role="button" href="{base}/players" slot="left">
      <i class="fas fa-arrow-left me-2"></i>
      {$_('pages.players-by-permission-group.players')}
    </a>
  </PageActions>

  <!-- All Players -->
  <div class="card">
    <div class="card-body">
      <CardHeader>
        <h5 class="card-title" slot="left">
          {$_('pages.players-by-permission-group.table-title', {values: {count: data.playerCount}})}
        </h5>
      </CardHeader>

      <!-- No Players -->
      {#if data.playerCount === 0}
        <NoContent />
      {:else}
        <!-- Players Table -->
        <div class="table-responsive">
          <table class="table table-hover mb-0">
            <thead>
              <tr>
                <th class="align-middle text-nowrap" scope="col"></th>
                <th class="align-middle text-nowrap" scope="col">{$_('pages.players-by-permission-group.table.player')}</th>
                <th class="align-middle text-nowrap table-primary" scope="col"
                  >{$_('pages.players-by-permission-group.table.permission-group')}</th>
                <th class="align-middle text-nowrap" scope="col">{$_('pages.players-by-permission-group.table.status')}</th>
                <th class="align-middle text-nowrap" scope="col">{$_('pages.players-by-permission-group.table.last-login')}</th>
                <th class="align-middle text-nowrap" scope="col">{$_('pages.players-by-permission-group.table.register-date')}</th>
              </tr>
            </thead>
            <tbody>
              {#each data.players as player, index (player)}
                <PlayerRow
                  player="{player}"
                  on:showAuthorizePlayerModalClick="{(event) =>
                    onShowAuthorizePlayerModalClick(event.detail.player)}"
                  on:showEditPlayerModalClick="{(event) =>
                    onShowEditPlayerModalClick(event.detail.player)}" />
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
  import ApiUtil from "$lib/api.util";
  import { showNetworkErrorOnCatch } from "$lib/Store";
  import { error } from "@sveltejs/kit";

  async function loadData({ page, permissionGroup, request }) {
    return new Promise((resolve, reject) => {
      ApiUtil.get({
        path: `/api/panel/players?permissionGroup=${permissionGroup}&page=${parseInt(
          page
        )}`,
        request,
      }).then((body) => {
        if (body.result === "ok") {
          const data = body;

          data.page = parseInt(page);

          resolve(data);
        } else {
          reject(body);
        }
      });
    });
  }

  /**
   * @type {import("@sveltejs/kit").Load}
   */
  export async function load(event) {
    const { parent } = event;
    const parentData = await parent();

    let data = {
      playerCount: 0,
      players: [],
      totalPage: 1,
      page: 1,
      permissionGroup: {
        id: -1,
        name: event.params.permissionGroup,
      },
    };

    if (parentData.NETWORK_ERROR) {
      return data;
    }

    await loadData({
      page: event.params.page || 1,
      permissionGroup: event.params.permissionGroup,
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
  import { getContext } from "svelte";
  import { _ } from "svelte-i18n";

  import { goto } from "$app/navigation";
  import { base } from "$app/paths";

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

  import PlayerRow from "$lib/component/rows/PlayerRow.svelte";
  import NoContent from "$lib/component/NoContent.svelte";
  import PageActions from "$lib/component/PageActions.svelte";
  import CardHeader from "$lib/component/CardHeader.svelte";

  export let data;

  const pageTitle = getContext("pageTitle");

  pageTitle.set($_('pages.players-by-permission-group.title', {values: {permissionGroupName: data.permissionGroup.name === "-" ? $_('pages.players-by-permission-group.player') : data.permissionGroup.name}}));

  function reloadData(
    page = data.page,
    permissionGroupName = data.permissionGroup.name
  ) {
    showNetworkErrorOnCatch((resolve, reject) => {
      loadData({
        page,
        permissionGroup: permissionGroupName,
      })
        .then((loadedData) => {
          resolve();

          if (page !== data.page) {
            goto(
              base +
                "/players/by-perm-group/" +
                permissionGroupName +
                "/" +
                page
            );
          } else {
            data = loadedData;
          }
        })
        .catch((body) => {
          if (body.error === "PAGE_NOT_FOUND") {
            resolve();

            reloadData(page - 1);
          } else if (body.error === "NOT_EXISTS") {
            goto(base + "/error-404");
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
</script>
