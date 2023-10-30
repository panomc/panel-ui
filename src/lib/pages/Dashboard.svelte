<!-- Dashboard Page -->
<div class="container">
  <!-- Welcome Alerts -->
  {#if data.gettingStartedBlocks.welcomeBoard}
    <div
      class="alert alert-success alert-dismissible animate__animated animate__zoomIn mb-3">
      <div class="row">
        <div class="col">
          <p class="lead">
            {@html $_("pages.dashboard.welcome-card.description")}
          </p>
        </div>
        <div class="w-100"></div>
        <div class="col-lg-3 mb-lg-0 mb-3">
          <h5>{$_("pages.dashboard.welcome-card.connect-server")}</h5>
          <p>
            {$_("pages.dashboard.welcome-card.connect-server-description")}
          </p>
          <button
            class="btn btn-sm btn-outline-dark w-100"
            data-bs-target="#connectServer"
            data-bs-toggle="modal">
            <i class="fas fa-plus me-2"></i>
            {$_("pages.dashboard.welcome-card.connect-server")}
          </button>
        </div>
        <div class="col-lg-3 mb-lg-0 mb-3">
          <ul class="list-unstyled">
            <h5>{$_("pages.dashboard.welcome-card.discover-title")}</h5>
            <li>
              <a class="alert-link" href="{base}/posts/create-post">
                <i class="fas fa-pen me-2"></i>
                {$_("pages.dashboard.welcome-card.publish-your-first-post")}
              </a>
            </li>
            <li>
              <a class="alert-link" href="{base}/view">
                <i class="fas fa-brush me-2"></i>
                {$_("pages.dashboard.welcome-card.change-theme")}
              </a>
            </li>
            <li>
              <a class="alert-link" href="{base}/tools">
                <i class="fas fa-tools me-2"></i>
                {$_("pages.dashboard.welcome-card.manage-tools")}
              </a>
            </li>
            <li>
              <a class="alert-link" href="{base}/players">
                <i class="fas fa-user-cog me-2"></i>{$_(
                  "pages.dashboard.welcome-card.review-players"
                )}
              </a>
            </li>
          </ul>
        </div>
        <div class="col-lg-3 mb-lg-0 mb-3">
          <ul class="list-unstyled">
            <h5>{$_("pages.dashboard.welcome-card.more-title")}</h5>
            <li>
              <a class="alert-link" href="javascript:void(0);">
                <i class="fas fa-puzzle-piece me-2"></i>
                {$_("pages.dashboard.welcome-card.discover-extensions")}
              </a>
            </li>
            <li>
              <a class="alert-link" href="javascript:void(0);">
                <i class="fas fa-palette me-2"></i>
                {$_("pages.dashboard.welcome-card.discover-themes")}
              </a>
            </li>
            <li>
              <a class="alert-link" href="javascript:void(0);" target="_blank">
                <i class="fas fa-book-open me-2"></i>
                {$_("pages.dashboard.welcome-card.discover-documentations")}
              </a>
            </li>
            <li>
              <a
                class="alert-link"
                href="https://panomc.com/discord"
                target="_blank">
                <i class="fab fa-discord me-2"></i>
                {$_("pages.dashboard.welcome-card.join-discord")}
              </a>
            </li>
          </ul>
        </div>
      </div>

      <button
        type="button"
        title="{$_('pages.dashboard.welcome-card.close-button')}"
        class="btn-close"
        data-bs-dismiss="alert"
        on:click="{onCloseGettingStartedCard}"></button>
    </div>
  {/if}

  <div class="row">
    <div class="col-6">
      <!-- Latest Tickets -->
      {#if hasPermission(Permissions.MANAGE_TICKETS)}
        <div class="card bg-white mb-3">
          <div class="card-body">
            <h5 class="card-title">
              {$_("pages.dashboard.last-tickets.title")}
            </h5>

            {#if data.tickets.length === 0}
              <NoContent />
            {:else}
              <table class="table table-hover mb-0">
                {#each data.tickets as ticket, index (ticket)}
                  <tbody>
                    <tr>
                      <td class="align-middle">
                        <a
                          use:tooltip="{[
                            ticket.writer.username,
                            { placement: 'bottom' },
                          ]}"
                          href="{base}/players/player/{ticket.writer.username}">
                          <img
                            src="https://minotar.net/avatar/{ticket.writer
                              .username}/32"
                            alt="{$_(
                              'pages.dashboard.last-tickets.player-name'
                            )}"
                            class="rounded-circle animate__animated animate__zoomIn"
                            height="32"
                            width="32" />
                        </a>
                      </td>
                      <td class="align-middle text-nowrap">
                        <a
                          href="{base}/tickets/ticket/{ticket.id}"
                          title="{$_('pages.dashboard.last-tickets.view')}"
                          >#{ticket.id} {ticket.title}</a>
                      </td>
                      <td class="align-middle text-nowrap">
                        <a
                          title="{$_('pages.dashboard.last-tickets.filter')}"
                          href="{base}/tickets/category/{ticket.category.url}">
                          {ticket.category.title === "-"
                            ? $_("pages.dashboard.last-tickets.no-category")
                            : ticket.category.title}
                        </a>
                      </td>
                      <td class="align-middle text-nowrap">
                        <TicketStatusBadge status="{ticket.status}" />
                      </td>
                      <td class="align-middle text-nowrap"
                        ><span><Date time="{ticket.lastUpdate}" /></span></td>
                    </tr>
                  </tbody>
                {/each}
              </table>
            {/if}
          </div>
        </div>
      {/if}
    </div>
    <div class="col-6">
      <div class="card bg-white mb-3">
        <div class="card-body"></div>
      </div>
    </div>
  </div>
</div>

<script context="module">
  import ApiUtil from "$lib/api.util.js";

  async function loadData({ request }) {
    return new Promise((resolve, reject) => {
      ApiUtil.get({
        path: `/api/panel/dashboard`,
        request,
      }).then((body) => {
        if (body.result === "ok") {
          resolve(body);
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
      gettingStartedBlocks: {
        welcomeBoard: false,
      },
      tickets: [],
    };

    if (parentData.NETWORK_ERROR) {
      return data;
    }

    await loadData({ request: event }).then((body) => {
      data = { ...data, ...body };
    });

    return data;
  }
</script>

<script>
  import { getContext } from "svelte";
  import { _ } from "svelte-i18n";

  import { base } from "$app/paths";

  import { showNetworkErrorOnCatch } from "$lib/Store";
  import { hasPermission, Permissions } from "$lib/auth.util";
  import tooltip from "$lib/tooltip.util";

  import NoContent from "$lib/component/NoContent.svelte";
  import TicketStatusBadge from "$lib/component/badges/TicketStatusBadge.svelte";
  import Date from "$lib/component/Date.svelte";

  export let data;

  const pageTitle = getContext("pageTitle");

  pageTitle.set("pages.dashboard.title");

  function onCloseGettingStartedCard() {
    showNetworkErrorOnCatch((resolve, reject) => {
      ApiUtil.post({
        path: "/api/panel/dashboard/closeGettingStartedCard",
      })
        .then(() => {
          resolve();
        })
        .catch(() => {
          reject();
        });
    });
  }
</script>
