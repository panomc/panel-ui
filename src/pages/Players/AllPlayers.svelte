<script>
  import { getPath, route } from "routve";

  import { isPageInitialized, showNetworkErrorOnCatch } from "../../Store";
  import ApiUtil from "../../pano/js/api.util";
  import Pagination from "../../components/Pagination.svelte";

  import Icon from "svelte-awesome";
  import { faListAlt } from "@fortawesome/free-regular-svg-icons";
  import {
    faUsers,
    faEllipsisV,
    faTimes,
    faUserCircle,
    faGlobe,
  } from "@fortawesome/free-solid-svg-icons";
  import Date from "../../components/Date.svelte";

  export let page = undefined;
  export let pageType = "all";

  let playersCount = 0;
  let players = [];
  let totalPage = 1;

  function getStatusFromPageType() {
    return pageType === "all" ? 1 : pageType === "hasPerm" ? 2 : 0;
  }

  function routePage(pageNumber, forceReload = false, findLastPage = false) {
    if (pageNumber !== page || forceReload) {
      showNetworkErrorOnCatch((resolve, reject) => {
        ApiUtil.post("panel/initPage/playersPage", {
          page: pageNumber,
          page_type: getStatusFromPageType(),
        })
          .then((response) => {
            if (response.data.result === "ok") {
              playersCount = response.data.players_count;
              players = response.data.players;
              totalPage = response.data.total_page;

              page = pageNumber;

              isPageInitialized.set(true);

              if (
                page === 1 &&
                getPath() !== "/panel/players" &&
                getPath() !== "/panel/players/" &&
                getPath() !== "/panel/players/" + pageType &&
                getPath() !== "/panel/players/" + pageType + "/"
              )
                route("/panel/players/" + pageType + "/" + page);
              else if (page !== 1)
                route("/panel/players/" + pageType + "/" + page);
            } else if (response.data.result === "error") {
              const errorCode = response.data.error;

              if (!findLastPage) {
                isPageInitialized.set(true);
              }

              if (errorCode === "PAGE_NOT_FOUND") {
                if (findLastPage) {
                  routePage(page - 1, true, true);
                } else route("/panel/error-404");
              }

              reject(errorCode);
            } else reject();
          })
          .catch(() => {
            reject();
          });
      });
    }
  }

  $: {
    routePage(typeof page === "undefined" ? 1 : parseInt(page));
  }
</script>

<!-- All Players Page -->
<div class="container">
  <!-- Action Menu -->
  <div class="row mb-3">
    <div class="col-auto">
      <a class="btn btn-link" role="button" href="/panel/players/permissions">
        <Icon data="{faUserCircle}" class="mr-1" />
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
            {playersCount}
            {pageType === "hasPerm"
              ? "Yetkili"
              : pageType === "banned"
              ? "Yasaklı"
              : ""} Oyuncu
          </h5>
        </div>
        <div class="col-md-6 col-12 text-md-right text-center">
          <div class="btn-group">
            <a
              class:active="{pageType === 'all'}"
              class="btn btn-sm btn-outline-light btn-link"
              role="button"
              href="/panel/players/all">
              Tümü
            </a>
            <a
              class:active="{pageType === 'hasPerm'}"
              class="btn btn-sm btn-outline-light btn-link"
              role="button"
              href="/panel/players/hasPerm">
              Yetkililer
            </a>
            <a
              class:active="{pageType === 'banned'}"
              class="btn btn-sm btn-outline-light btn-link text-danger"
              role="button"
              href="/panel/players/banned">
              Yasaklı
            </a>
          </div>
        </div>
      </div>

      <!-- No Players -->
      {#if playersCount === 0}
        <div class="container text-center">
          <Icon data="{faUsers}" scale="3" class="text-glass m-3" />
          <p class="text-gray">Burada içerik yok.</p>
        </div>
      {:else}
        <!-- Players Table -->
        <div class="table-responsive">
          <table class="table mb-0">
            <thead>
              <tr>
                <th class="align-middle text-nowrap" scope="col"></th>
                <th class="align-middle text-nowrap" scope="col">İsim</th>
                <th class="align-middle text-nowrap" scope="col">Talepler</th>
                <th class="align-middle text-nowrap" scope="col">Durum</th>
                <th class="align-middle text-nowrap" scope="col">Son Oturum</th>
                <th class="align-middle text-nowrap" scope="col">Kayıt</th>
              </tr>
            </thead>
            <tbody>
              {#each players as player, index (player)}
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
                        <Icon data="{faEllipsisV}" />
                      </a>
                      <div
                        aria-labelledby="playerAction"
                        class="dropdown-menu dropdown-menu-right">
                        <a class="dropdown-item" href="javascript:void(0);">
                          <Icon
                            data="{faUserCircle}"
                            class="mr-1 text-primary" />
                          Yetkilendir
                        </a>
                        <a
                          class="dropdown-item"
                          data-target="#conformBanTickets"
                          data-toggle="modal"
                          href="javascript:void(0);">
                          <Icon data="{faTimes}" class="mr-1 text-danger" />
                          Yasakla
                        </a>
                      </div>
                    </div>
                  </th>
                  <td class="min-w-200px align-middle text-nowrap">
                    <a title="Oyuncu Profiline Git" href="/panel/players/player/{player.username}">
                      <img
                        alt="Oyuncu Adı"
                        class="rounded-circle border mr-3"
                        height="32"
                        src="https://minotar.net/avatar/{player.username}"
                        width="32" />
                      {player.username}
                    </a>
                  </td>
                  <td class="align-middle text-nowrap">
                    {player.ticket_count}
                    <i
                      aria-hidden="true"
                      class="fa fa-times text-danger fa-fw"
                      v-tooltip:top="'Talepleri Yasaklı'"></i>
                  </td>
                  <td class="align-middle text-nowrap">
                    <span
                      class="badge badge-pill badge-lightsecondary text-success"
                      v-tooltip:top="'Sitede'">
                      <i aria-hidden="true" class="fa fa-globe fa-fw"></i>
                      <Icon data="{faGlobe}" />
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
        page="{page}"
        totalPage="{totalPage}"
        on:firstPageClick="{() => routePage(1)}"
        on:lastPageClick="{() => routePage(totalPage)}"
        on:pageLinkClick="{(event) => routePage(event.detail.page)}" />
    </div>
  </div>
</div>
