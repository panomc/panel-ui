<script>
  import ConfirmCloseTicketModal from "../../components/modals/ConfirmCloseTicketModal.svelte";

  import { isPageInitialized, showNetworkErrorOnCatch } from "../../Store";
  import ApiUtil from "../../util/api.util";

  import Icon from "svelte-awesome";
  import { faListAlt } from "@fortawesome/free-regular-svg-icons";
  import { faTicketAlt } from "@fortawesome/free-solid-svg-icons";

  import { get } from "svelte/store";
  import { getPath, route } from "routve";

  export let page = undefined;
  export let pageType = "all";

  let ticketsCount = 0;
  let tickets = [];
  let totalPage = 1;
  let pages = [];

  function getStatusFromPageType() {
    return pageType === "all" ? 1 : pageType === "waitingReply" ? 2 : 0;
  }

  function routePage(pageNumber, forceReload = false) {
    if (pageNumber !== page || forceReload) {
      showNetworkErrorOnCatch(
        () =>
          new Promise((resolve, reject) => {
            ApiUtil.post("panel/initPage/ticketPage", {
              page: pageNumber,
              page_type: getStatusFromPageType(),
            })
              .then((response) => {
                if (response.data.result === "ok") {
                  ticketsCount = response.data.tickets_count;
                  tickets = response.data.tickets;
                  totalPage = response.data.total_page;

                  pages = [];

                  for (let i = 1; i <= totalPage; i++) {
                    pages.push(i);
                  }

                  page = pageNumber;

                  if (
                    page === 1 &&
                    getPath() !== "/panel/tickets" &&
                    getPath() !== "/panel/tickets/" &&
                    getPath() !== "/panel/tickets/" + pageType &&
                    getPath() !== "/panel/tickets/" + pageType + "/"
                  )
                    route(
                      "/panel/tickets/" + pageType + "/" + page
                    );
                  else if (page !== 1)
                    route(
                      "/panel/tickets/" + pageType + "/" + page
                    );

                  isPageInitialized.set(true);

                  resolve();
                } else if (response.data.result === "error") {
                  const errorCode = response.data.error;

                  isPageInitialized.set(true);

                  if (errorCode === "PAGE_NOT_FOUND") {
                    route("/panel/error-404");
                  }

                  resolve();
                } else reject();
              })
              .catch(() => {
                reject();
              });
          })
      );
    }
  }

  function onLastPageClick() {
    routePage(totalPage);
  }

  function onFirstPageClick() {
    routePage(1);
  }

  function onPageLinkClick(index) {
    routePage(index);
  }

  function checkPageLinkCurrentPage(page, index) {
    return page !== index;
  }

  routePage(
    typeof page === "undefined" ? 1 : parseInt(page) === 0 ? 1 : parseInt(page)
  );
</script>

<!-- Tickets Page -->

<div class="row mb-3">
  <div class="col-md-4 col-6">
    <a class="btn btn-link" role="button" href="/panel/tickets/categories">
      <Icon data="{faListAlt}" class="mr-1" />
      Kategoriler
    </a>
  </div>
</div>

<!-- All Tickets -->
<div class="card">
  <div class="card-body">
    <div class="row justify-content-between">
      <div class="col-md-6 col-12 text-md-left text-center">
        <h5 class="card-title">
          {ticketsCount} Talep - {page}
          <span class="text-primary">/</span>
          {totalPage}
        </h5>
      </div>
      <div class="col-md-6 col-12 text-md-right text-center">
        <div class="btn-group">
          <a
            class="btn btn-sm btn-outline-light btn-link"
            class:active="{pageType === 'all'}"
            role="button"
            href="/panel/tickets/all"
          >
            Tümü
          </a>
          <a
            class="btn btn-sm btn-outline-light btn-link"
            class:active="{pageType === 'waitingReply'}"
            role="button"
            href="/panel/tickets/waitingReply"
          >
            Yanıtlanmadı
          </a>
          <a
            class="btn btn-sm btn-outline-light btn-link text-danger"
            class:active="{pageType === 'closed'}"
            role="button"
            href="/panel/tickets/closed"
          >
            Kapalı
          </a>
        </div>
      </div>
    </div>

    <!-- No Tickets -->
    {#if ticketsCount === 0}
      <div class="container text-center">
        <Icon data="{faTicketAlt}" scale="3" class="text-glass m-3" />
        <p class="text-gray">Burada içerik yok.</p>
      </div>
    {:else}
      <!-- Tickets Table -->
      <div class="table-responsive">
        <table class="table mb-0">
          <thead>
            <tr>
              <th scope="col">
                <a href="#">Seç</a>
              </th>
              <th scope="col">Talep</th>
              <th class="min-w-200px" scope="col">Konu</th>
              <th scope="col">Durum</th>
              <th scope="col">Kategori</th>
              <th scope="col">Yazan</th>
              <th scope="col">Son Yanıt</th>
            </tr>
          </thead>
          <tbody>
            {#each tickets as ticket, index (ticket)}
              <tr>
                <th scope="row">
                  <div class="d-flex flex-row align-items-center">
                    <div class="custom-control custom-checkbox">
                      <input
                        class="custom-control-input"
                        id="postCheck{ticket.id}"
                        type="checkbox"
                      />
                      <label
                        class="custom-control-label"
                        for="postCheck{ticket.id}"
                      ></label>
                    </div>
                  </div>
                </th>
                <td>
                  <b class="text-muted" title="Talep NO">#{ticket.id}</b>
                </td>
                <td>
                  <a href="/panel/tickets/{ticket.id}" title="Talebi Görüntüle">
                    {ticket.title}
                  </a>
                </td>
                <td>
                  {#if ticket.status === 1}
                    <span class="text-center rounded border">Yanıtlandı</span>
                  {:else if ticket.status === 2}
                    <span class="text-center rounded bg-success text-white">
                      Yeni
                    </span>
                  {:else if ticket.status === 0}
                    <span class="text-center rounded bg-danger text-white">
                      Kapalı
                    </span>
                  {/if}
                </td>
                <td>{ticket.category.title}</td>
                <td>{ticket.writer.username}</td>
                <td>1 saat önce</td>
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
    {/if}
    <!-- Pagination -->
    <nav class="pt-3">
      <ul class="pagination pagination-sm mb-0 justify-content-start">
        {#if checkPageLinkCurrentPage(page, totalPage)}
          <a class="page-link" href="javascript:void(0);" title="Önceki Sayfa">
            <li class="page-item" on:click="{onFirstPageClick}">
              <span aria-hidden="true">&laquo;</span>
            </li>
          </a>
        {:else}
          <li
            class="page-item page-link disabled"
            disabled="true"
            on:click="{onFirstPageClick}"
          >
            <span aria-hidden="true">&laquo;</span>
          </li>
        {/if}

        {#each pages as index}
          {#if checkPageLinkCurrentPage(page, index)}
            <a href="javascript:void(0);" on:click="{onPageLinkClick(index)}">
              <li class="page-item page-link">{index}</li>
            </a>
          {:else}
            <li class="page-item page-link">{index}</li>
          {/if}
        {/each}

        {#if checkPageLinkCurrentPage(page, totalPage)}
          <a href="javascript:void(0);" title="Sonraki Sayfa">
            <li class="page-item page-link" on:click="{onLastPageClick}">
              <span aria-hidden="true">&raquo;</span>
            </li>
          </a>
        {:else}
          <li class="page-item page-link disabled" disabled="true">
            <span aria-hidden="true">&raquo;</span>
          </li>
        {/if}
      </ul>
    </nav>
  </div>
</div>

<ConfirmCloseTicketModal />
