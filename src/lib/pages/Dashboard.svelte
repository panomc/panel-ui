<!-- Dashboard Page -->
<div class="container">
  <!-- Welcome Alerts -->
  {#if data.gettingStartedBlocks.welcomeBoard}
    <div
      class="alert alert-primary bg-minecraft alert-dismissible animate__animated animate__zoomIn mb-3">
      <div class="row">
        <div class="col-12 pb-3">
          <h3 class="card-title">Hoş Geldiniz</h3>
          <p class="lead">
            Pano, web sunucunuza başarıyla kuruldu ve kullanıma hazır! 🚀
            <br />
            İşte başlarken yapabilecekleriniz 👇:
          </p>
        </div>
        <div class="col-lg-4 mb-lg-0 mb-3">
          <h5>Sunucu Bağlayın</h5>
          <p>
            Pano'yu oyun sunucunuza bağlayın ve daha fazla yönetim özelliklerine
            erişin.
          </p>
          <button
            class="btn btn-sm btn-primary"
            data-bs-target="#connectServer"
            data-bs-toggle="modal">
            <i class="fas fa-plus me-2"></i>
            Sunucu Bağla
          </button>
        </div>
        <div class="col-lg-4 mb-lg-0 mb-3">
          <ul class="list-unstyled">
            <h5>Menüden Öneriler</h5>
            <li>
              <a class="alert-link" href="{base}/posts/create-post">
                <i class="fas fa-pen me-2"></i>
                İlk Yazınızı Yayınlayın
              </a>
            </li>
            <li>
              <a class="alert-link" href="{base}/view">
                <i class="fas fa-brush me-2"></i>
                Sitenizin Görünümünü Belirleyin
              </a>
            </li>
            <li>
              <a class="alert-link" href="{base}/tools">
                <i class="fas fa-tools me-2"></i>
                Araçları Yönetin
              </a>
            </li>
            <li>
              <a class="alert-link" href="{base}/players">
                <i class="fas fa-user-cog me-2"></i>
                Oyuncularınızı İnceleyin
              </a>
            </li>
          </ul>
        </div>
        <div class="col-lg-4 mb-lg-0 mb-3">
          <ul class="list-unstyled">
            <h5>Daha Fazlası</h5>
            <li>
              <a class="alert-link" href="javascript:void(0);">
                <i class="fas fa-puzzle-piece me-2"></i>
                Pano Eklentilerini Keşfedin
              </a>
            </li>
            <li>
              <a class="alert-link" href="javascript:void(0);">
                <i class="fas fa-palette me-2"></i>
                Pano Temalarını Keşfedin
              </a>
            </li>
            <li>
              <a class="alert-link" href="javascript:void(0);" target="_blank">
                <i class="fas fa-book-open me-2"></i>
                Dökümantasyonları İnceleyin
              </a>
            </li>
            <li>
              <a
                class="alert-link"
                href="https://panomc.com/discord"
                target="_blank">
                <i class="fab fa-discord me-2"></i>
                Discord Topluluğumuza Katılın
              </a>
            </li>
          </ul>
        </div>
      </div>

      <button
        type="button"
        class="btn-close"
        data-bs-dismiss="alert"
        on:click="{onCloseGettingStartedCard}"></button>
    </div>
  {/if}

  {#if hasPermission(Permissions.MANAGE_TICKETS)}
    <!-- Latest Tickets -->
    <div class="card bg-white mb-3">
      <div class="card-body">
        <div class="row justify-content-between mb-3">
          <div class="col">
            <h5 class="card-title">Son Talepler</h5>
          </div>
        </div>

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
                      src="https://crafthead.net/avatar/{ticket.writer
                          .username}/32"
                      alt="Oyuncu Adı"
                      class="rounded-circle animate__animated animate__zoomIn"
                      height="32"
                      width="32" />
                  </a>
                </td>
                <td class="align-middle text-nowrap">
                  <a
                    href="{base}/tickets/ticket/{ticket.id}"
                    title="Görüntüle">#{ticket.id} {ticket.title}</a>
                </td>
                <td class="align-middle text-nowrap">
                  <a
                    title="Filtrele"
                    href="{base}/tickets/category/{ticket.category.url}">
                    {ticket.category.title === "-"
                      ? "Kategorisiz"
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

    await loadData({ request: event }).then(
      (body) => {
        data = { ...data, ...body };
      }
    );

    return data;
  }
</script>

<script>
  import { getContext } from "svelte";
  import { base } from "$app/paths";

  import { showNetworkErrorOnCatch } from "$lib/Store";
  import { hasPermission, Permissions } from "$lib/auth.util";
  import tooltip from "$lib/tooltip.util";

  import NoContent from "$lib/component/NoContent.svelte";
  import TicketStatusBadge from "$lib/component/badges/TicketStatusBadge.svelte";
  import Date from "$lib/component/Date.svelte";


  export let data;

  const pageTitle = getContext("pageTitle");

  pageTitle.set("Panel");

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
