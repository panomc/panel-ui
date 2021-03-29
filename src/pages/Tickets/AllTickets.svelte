<!-- Tickets Page -->

<div class="row mb-3">
  <div class="col-md-4 col-6">
    <a class="btn btn-link" role="button" href="/panel/tickets/categories">
      <Icon data="{faListAlt}" class="mr-1" />
      Talep Kategorileri
    </a>
  </div>
  <div class="col d-flex">
    <div
      class:d-none="{firstLoad}"
      class="ml-auto animated {getListOfChecked($checkedList).length > 0
        ? 'fadeIn'
        : 'fadeOut'}
      faster">
      <a
        class="btn btn-outline-bittersweet"
        class:disabled="{getListOfChecked($checkedList).length === 0}"
        role="button"
        href="javascript:void(0);"
        on:click="{onShowCloseTicketsModalClick}">
        <Icon data="{faTimes}" class="mr-1" />
        Kapat
      </a>
      <a
        class="btn btn-outline-danger"
        class:disabled="{getListOfChecked($checkedList).length === 0}"
        role="button"
        href="javascript:void(0);"
        on:click="{onShowDeleteTicketsModalClick}">
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
          {ticketsCount}
          {pageType === "waitingReply"
            ? "Yeni"
            : pageType === "closed"
            ? "Kapalı"
            : ""} Talep{getListOfChecked($checkedList).length > 0
            ? ", " + getListOfChecked($checkedList).length + " adet seçildi"
            : ""}
        </h5>
      </div>
      <div class="col-md-6 col-12 text-md-right text-center">
        <div class="btn-group">
          <a
            class="btn btn-sm btn-outline-light btn-link"
            class:active="{pageType === 'all'}"
            role="button"
            href="/panel/tickets/all">
            Tümü
          </a>
          <a
            class="btn btn-sm btn-outline-light btn-link"
            class:active="{pageType === 'waitingReply'}"
            role="button"
            href="/panel/tickets/waitingReply">
            Yeni
          </a>
          <a
            class="btn btn-sm btn-outline-light btn-link text-danger"
            class:active="{pageType === 'closed'}"
            role="button"
            href="/panel/tickets/closed">
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
              <th class="text-nowrap align-middle" scope="col">
                <div class="custom-control custom-checkbox">
                  <input
                    type="checkbox"
                    class="custom-control-input"
                    on:click="{onSelectAllClick}"
                    checked="{isAllTicketsSelected(tickets, $checkedList)}"
                    id="selectAll" />
                  <label class="custom-control-label" for="selectAll"></label>
                </div>
              </th>
              <th class="min-w-200px align-middle" scope="col">Başlık</th>
              <th class="align-middle" scope="col">Durum</th>
              <th class="align-middle" scope="col">Kategori</th>
              <th class="align-middle" scope="col">Açan</th>
              <th class="align-middle" scope="col">Son Yanıt</th>
            </tr>
          </thead>
          <tbody>
            {#each tickets as ticket, index (ticket)}
              <tr class:bg-lightprimary="{ticket.selected}">
                <th scope="row">
                  <div class="row flex-nowrap">
                    <div class="custom-control custom-checkbox mx-2">
                      <input
                        class="custom-control-input"
                        id="postCheck{ticket.id}"
                        type="checkbox"
                        bind:checked="{$checkedList[ticket.id]}" />
                      <label
                        class="custom-control-label"
                        for="postCheck{ticket.id}"></label>
                    </div>
                    <div class="dropdown">
                      <a
                        class="btn btn-sm py-0"
                        aria-expanded="false"
                        aria-haspopup="true"
                        data-toggle="dropdown"
                        href="javascript:void(0);"
                        id="postAction">
                        <Icon data="{faEllipsisV}" />
                      </a>
                      <div
                        aria-labelledby="postAction"
                        class="dropdown-menu dropdown-menu-right">
                        {#if ticket.status !== 3}
                          <a
                            class="dropdown-item"
                            href="javascript:void(0);"
                            on:click="{onShowCloseTicketModalClick(ticket.id)}">
                            <Icon
                              data="{faTimes}"
                              class="mr-1 text-bittersweet" />
                            Kapat
                          </a>
                        {/if}

                        <a
                          class="dropdown-item"
                          href="javascript:void(0);"
                          on:click="{onShowDeleteTicketModalClick(ticket.id)}">
                          <Icon data="{faTrash}" class="text-danger mr-1" />
                          Sil
                        </a>
                      </div>
                    </div>
                  </div>
                </th>
                <td class="align-middle text-nowrap">
                  <a
                    href="/panel/tickets/ticket/{ticket.id}"
                    title="Talebi Görüntüle">
                    #{ticket.id}
                    {ticket.title}
                  </a>
                </td>
                <td class="align-middle text-nowrap">
                  <TicketStatus status="{ticket.status}" />
                </td>
                <td class="align-middle text-nowrap">
                  {ticket.category.title}
                </td>
                <td class="align-middle">
                  <a
                    href="/panel/players/player/{ticket.writer.username}"
                    use:tooltip="{['top', ticket.writer.username]}">
                    <img
                      src="https://minotar.net/avatar/{ticket.writer
                        .username}/32"
                      alt="Oyuncu Adı"
                      class="rounded-circle border"
                      height="32"
                      width="32" />
                  </a>
                </td>
                <td class="align-middle text-nowrap">
                  <Date time="{ticket.last_update}" />
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

<ConfirmCloseTicketModal />
<ConfirmDeleteTicketModal />

<script context="module">
  import { writable, get } from "svelte/store";

  let checkedList = writable([]);
</script>

<script>
  import { getPath, route } from "routve";

  import ConfirmCloseTicketModal, {
    setCallback as setCloseTicketModalCallback,
    show as showCloseTicketModal,
    onHide as onConfirmCloseTicketModalHide,
  } from "../../components/modals/ConfirmCloseTicketModal.svelte";
  import ConfirmDeleteTicketModal, {
    setCallback as setDeleteTicketModalCallback,
    show as showDeleteTicketModal,
    onHide as onConfirmDeleteTicketModalHide,
  } from "../../components/modals/ConfirmDeleteTicketModal.svelte";

  import { isPageInitialized, showNetworkErrorOnCatch } from "../../Store";
  import ApiUtil from "../../pano-ui/js/api.util";
  import tooltip from "../../pano-ui/js/tooltip.util";

  import Icon from "svelte-awesome";
  import { faListAlt } from "@fortawesome/free-regular-svg-icons";
  import {
    faTicketAlt,
    faEllipsisV,
    faTrash,
    faTimes,
  } from "@fortawesome/free-solid-svg-icons";

  import Pagination from "../../components/Pagination.svelte";
  import TicketStatus from "../../components/TicketStatus.svelte";
  import { onHide as onAddEditPostCategoryModalHide } from "../../components/modals/PostCategoriesAddEditModal.svelte";
  import Date from "../../components/Date.svelte";

  export let page = undefined;
  export let pageType = "all";

  let ticketsCount = 0;
  let tickets = [];
  let totalPage = 1;

  let firstLoad = true;

  function getStatusFromPageType() {
    return pageType === "all" ? 2 : pageType === "waitingReply" ? 1 : 3;
  }

  function routePage(pageNumber, forceReload = false, findLastPage = false) {
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

              resolve();
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

  function onShowDeleteTicketsModalClick() {
    getListOfChecked(get(checkedList)).forEach(
      (id) =>
        (tickets[
          tickets.indexOf(
            tickets.find(
              (ticketInTickets) => ticketInTickets.id === parseInt(id)
            )
          )
        ].selected = true)
    );

    showDeleteTicketModal(getListOfChecked(get(checkedList)));
  }

  function onShowDeleteTicketModalClick(id) {
    tickets[
      tickets.indexOf(
        tickets.find((ticketInTickets) => ticketInTickets.id === id)
      )
    ].selected = true;

    showDeleteTicketModal([id]);
  }

  function onShowCloseTicketsModalClick() {
    getListOfChecked(get(checkedList)).forEach(
      (id) =>
        (tickets[
          tickets.indexOf(
            tickets.find(
              (ticketInTickets) => ticketInTickets.id === parseInt(id)
            )
          )
        ].selected = true)
    );

    showCloseTicketModal(getListOfChecked(get(checkedList)));
  }

  function onShowCloseTicketModalClick(id) {
    tickets[
      tickets.indexOf(
        tickets.find((ticketInTickets) => ticketInTickets.id === id)
      )
    ].selected = true;

    showCloseTicketModal([id]);
  }

  setDeleteTicketModalCallback((selectedTickets) => {
    Object.values(selectedTickets).forEach((id) => {
      $checkedList[id] = false;
    });

    routePage(page, true, page !== 1);
  });

  onConfirmDeleteTicketModalHide((selectedTickets) => {
    Object.values(selectedTickets).forEach((id) => {
      tickets[
        tickets.indexOf(
          tickets.find((ticketInTickets) => ticketInTickets.id === parseInt(id))
        )
      ].selected = false;
    });
  });

  setCloseTicketModalCallback((selectedTickets) => {
    Object.values(selectedTickets).forEach((id) => {
      $checkedList[id] = false;
    });

    routePage(page, true, page !== 1);
  });

  onConfirmCloseTicketModalHide((selectedTickets) => {
    Object.values(selectedTickets).forEach((id) => {
      tickets[
        tickets.indexOf(
          tickets.find((ticketInTickets) => ticketInTickets.id === parseInt(id))
        )
      ].selected = false;
    });
  });

  $: {
    routePage(typeof page === "undefined" ? 1 : parseInt(page));
  }
</script>
