<script context="module">
  import { writable } from "svelte/store";

  let checkedList = writable([]);
</script>

<script>
  import ConfirmCloseTicketModal from "../../components/modals/ConfirmCloseTicketModal.svelte";
  import ConfirmDeleteTicketModal from "../../components/modals/ConfirmDeleteTicketModal.svelte";

  import { isPageInitialized, showNetworkErrorOnCatch } from "../../Store";
  import ApiUtil from "../../pano/js/api.util";
  import tooltip from "../../pano/js/tooltip.util";

  import Icon from "svelte-awesome";
  import { faListAlt } from "@fortawesome/free-regular-svg-icons";
  import {
    faTicketAlt,
    faEllipsisV,
    faTrash,
  } from "@fortawesome/free-solid-svg-icons";

  import { getPath, route } from "routve";
  import Pagination from "../../components/Pagination.svelte";

  export let page = undefined;
  export let pageType = "all";

  let ticketsCount = 0;
  let tickets = [];
  let totalPage = 1;

  let firstLoad = true;

  let confirmCloseTicketModal;
  let closingTicketsLoading = false;

  function getStatusFromPageType() {
    return pageType === "all" ? 2 : pageType === "waitingReply" ? 1 : 3;
  }

  function routePage(pageNumber, forceReload = false, handler = null) {
    if (pageNumber !== page || forceReload) {
      showNetworkErrorOnCatch((resolve, reject) => {
        ApiUtil.post("panel/initPage/ticketPage", {
          page: pageNumber,
          page_type: getStatusFromPageType(),
        })
          .then((response) => {
            if (response.data.result === "ok") {
              ticketsCount = response.data.tickets_count;
              tickets = response.data.tickets;
              totalPage = response.data.total_page;

              page = pageNumber;

              if (
                page === 1 &&
                getPath() !== "/panel/tickets" &&
                getPath() !== "/panel/tickets/" &&
                getPath() !== "/panel/tickets/" + pageType &&
                getPath() !== "/panel/tickets/" + pageType + "/"
              )
                route("/panel/tickets/" + pageType + "/" + page);
              else if (page !== 1)
                route("/panel/tickets/" + pageType + "/" + page);

              isPageInitialized.set(true);

              if (handler) handler();

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
      });
    }
  }

  function getListOfChecked(list) {
    const result = Object.keys(list).filter((key) => list[key]);

    if (result.length > 0) firstLoad = false;

    return result;
  }

  function onSelectAllClick() {
    const isAllSelected = isAllTicketsSelected(tickets, $checkedList);

    tickets.forEach((ticket) => {
      $checkedList[ticket.id] = !isAllSelected;
    });
  }

  function isAllTicketsSelected(ticketsList, selectedList) {
    let isAllSelected = true;

    ticketsList.forEach((ticket) => {
      if (!selectedList[ticket.id]) isAllSelected = false;
    });

    return isAllSelected;
  }

  function clearSelections() {
    Object.keys($checkedList)
      .filter((key) => $checkedList[key])
      .forEach((key) => {
        $checkedList[key] = false;
      });
  }

  function onConfirmCloseTicketsButtonClick() {
    closingTicketsLoading = true;

    showNetworkErrorOnCatch((resolve, reject) => {
      ApiUtil.post("panel/ticket/close/selectedList", {
        tickets: Object.values(getListOfChecked($checkedList)),
      })
        .then((response) => {
          if (response.data.result === "ok") {
            clearSelections();

            routePage(page, true, () => {
              closingTicketsLoading = false;

              confirmCloseTicketModal.close();
            });

            resolve();
          } else reject();
        })
        .catch(() => {
          reject();
        });
    });
  }

  routePage(typeof page === "undefined" ? 1 : parseInt(page));
</script>

<!-- Tickets Page -->

<div class="row mb-3">
  <div class="col-md-4 col-6">
    <a class="btn btn-link" role="button" href="/panel/tickets/categories">
      <Icon data="{faListAlt}" class="mr-1" />
      Kategoriler
    </a>
  </div>
  <div class="col d-flex">
    <div
      class:d-none="{firstLoad}"
      class="ml-auto animated {getListOfChecked($checkedList).length > 0 ? 'fadeIn' : 'fadeOut'}
      faster"
    >
      <a
        class="btn btn-outline-primary"
        class:disabled="{getListOfChecked($checkedList).length === 0}"
        role="button"
        data-target="#confirmCloseTicket"
        data-toggle="modal"
        data-backdrop="static"
        data-keyboard="false"
        href="javascript:void(0);"
      >
        Kapat
      </a>
      <a
        class="btn btn-outline-danger"
        class:disabled="{getListOfChecked($checkedList).length === 0}"
        role="button"
        data-target="#confirmDeleteTicket"
        data-toggle="modal"
        data-backdrop="static"
        data-keyboard="false"
        href="javascript:void(0);"
      >
        <Icon data="{faTrash}" class="mr-1" />
        Sil
      </a>
    </div>
  </div>
</div>

<!-- All Tickets -->
<div class="card">
  <div class="card-body">
    <div class="row justify-content-between pb-3 align-items-center">
      <div class="col-md-6 col-12 text-md-left text-center">
        <h5 class="card-title mb-md-0">
          {ticketsCount} Talep{getListOfChecked($checkedList).length > 0 ? ', ' + getListOfChecked($checkedList).length + ' adet seçildi' : ''}
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
            Yeni
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
              <th class="text-nowrap" scope="col">
                <a href="javascript:void(0);" on:click="{onSelectAllClick}">
                  {isAllTicketsSelected(tickets, $checkedList) ? 'Tümünü Kaldır' : 'Tümünü Seç'}
                </a>
              </th>
              <th scope="col">Talep</th>
              <th class="min-w-200px" scope="col">Konu</th>
              <th scope="col">Durum</th>
              <th scope="col">Kategori</th>
              <th scope="col">Yazar</th>
              <th scope="col">Son Yanıt</th>
            </tr>
          </thead>
          <tbody>
            {#each tickets as ticket, index (ticket)}
              <tr>
                <th scope="row">
                  <div class="row flex-nowrap">

                    <div class="custom-control custom-checkbox mx-2">
                      <input
                        class="custom-control-input"
                        id="postCheck{ticket.id}"
                        type="checkbox"
                        bind:checked="{$checkedList[ticket.id]}"
                      />
                      <label
                        class="custom-control-label"
                        for="postCheck{ticket.id}"
                      ></label>
                    </div>
                    <div class="dropdown">
                      <a
                        class="btn btn-sm py-0"
                        aria-expanded="false"
                        aria-haspopup="true"
                        data-toggle="dropdown"
                        href="javascript:void(0);"
                        id="postAction"
                      >
                        <Icon data="{faEllipsisV}" />
                      </a>
                      <div
                        aria-labelledby="postAction"
                        class="dropdown-menu dropdown-menu-right"
                      >

                        <!--                  @click="onDeleteClick(category.id)"-->
                        <a
                          class="dropdown-item"
                          data-target="#confirmDeleteTicketCategory"
                          data-toggle="modal"
                          href="javascript:void(0);"
                        >
                          <Icon data="{faTrash}" class="text-danger mr-1" />
                          Sil
                        </a>
                      </div>
                    </div>
                  </div>
                </th>
                <td>#{ticket.id}</td>
                <td class="text-nowrap">
                  <a
                    href="/panel/tickets/ticket/{ticket.id}"
                    title="Talebi Görüntüle"
                  >
                    {ticket.title}
                  </a>
                </td>
                <td>
                  {#if ticket.status === 1}
                    <span class="badge badge-secondary badge-pill">Yeni</span>
                  {:else if ticket.status === 2}
                    <span class="badge badge-sunflower badge-pill">
                      Yanıtlandı
                    </span>
                  {:else if ticket.status === 3}
                    <span class="badge badge-bittersweet badge-pill">
                      Kapalı
                    </span>
                  {/if}
                </td>
                <td>{ticket.category.title}</td>
                <td>
                  <a href="#" use:tooltip="{['top', ticket.writer.username]}">
                    <img
                      alt="Oyuncu Adı"
                      class="rounded-circle border"
                      height="32"
                      src="https://minotar.net/avatar/{ticket.writer.username}/32"
                      width="32"
                    />
                  </a>
                </td>
                <td class="text-nowrap">1 saat önce</td>
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
    {/if}
    <!-- Pagination -->
    <Pagination
      {page}
      {totalPage}
      on:firstPageClick="{() => routePage(1)}"
      on:lastPageClick="{() => routePage(totalPage)}"
      on:pageLinkClick="{(event) => routePage(event.detail.page)}"
    />
  </div>
</div>

<ConfirmCloseTicketModal
  on:confirmButtonClick="{onConfirmCloseTicketsButtonClick}"
  selectedTickets="{getListOfChecked($checkedList)}"
  bind:this="{confirmCloseTicketModal}"
  loading="{closingTicketsLoading}"
/>
<ConfirmDeleteTicketModal selectedTickets="{getListOfChecked($checkedList)}" />
