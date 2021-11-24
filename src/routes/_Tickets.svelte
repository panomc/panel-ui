<!-- Tickets Page -->
<article class="container">
  <div class="row mb-3">
    <div class="col-md-4 col-6">
      <a class="btn btn-link" role="button" href="{base}/tickets/categories">
        <i class="fas fa-list-alt mr-1"></i>
        Talep Kategorileri
      </a>
    </div>
    <div class="col d-flex">
      <div
        class:d-none="{firstLoad}"
        class="ml-auto animated {getListOfChecked($checkedList).length > 0
          ? 'fadeIn'
          : 'fadeOut'}
      faster"
      >
        <a
          class="btn btn-outline-bittersweet"
          class:disabled="{getListOfChecked($checkedList).length === 0}"
          role="button"
          href="javascript:void(0);"
          on:click="{onShowCloseTicketsModalClick}"
        >
          <i class="fas fa-times mr-1"></i>
          Kapat
        </a>
        <a
          class="btn btn-outline-danger"
          class:disabled="{getListOfChecked($checkedList).length === 0}"
          role="button"
          href="javascript:void(0);"
          on:click="{onShowDeleteTicketsModalClick}"
        >
          <i class="fas fa-trash mr-1"></i>
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
            {data.tickets_count}
            {data.pageType === PageTypes.WAITING_REPLY
              ? "Yeni"
              : data.pageType === PageTypes.CLOSED
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
              class:active="{data.pageType === PageTypes.ALL}"
              role="button"
              href="{base}/tickets/all"
            >
              Tümü
            </a>
            <a
              class="btn btn-sm btn-outline-light btn-link"
              class:active="{data.pageType === PageTypes.WAITING_REPLY}"
              role="button"
              href="{base}/tickets/waitingReply"
            >
              Yeni
            </a>
            <a
              class="btn btn-sm btn-outline-light btn-link text-danger"
              class:active="{data.pageType === PageTypes.CLOSED}"
              role="button"
              href="{base}/tickets/closed"
            >
              Kapalı
            </a>
          </div>
        </div>
      </div>

      <!-- No Tickets -->
      {#if data.tickets_count === 0}
        <div class="container text-center">
          <i class="fas fa-ticket-alt fa-3x text-glass m-3"></i>
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
                      checked="{isAllTicketsSelected(
                        data.tickets,
                        $checkedList
                      )}"
                      id="selectAll"
                    />
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
              {#each data.tickets as ticket, index (ticket)}
                <tr class:bg-lightprimary="{ticket.selected}">
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
                          for="postCheck{ticket.id}"></label>
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
                          <i class="fas fa-ellipsis-v"></i>
                        </a>
                        <div
                          aria-labelledby="postAction"
                          class="dropdown-menu dropdown-menu-right"
                        >
                          {#if ticket.status !== 3}
                            <a
                              class="dropdown-item"
                              href="javascript:void(0);"
                              on:click="{onShowCloseTicketModalClick(
                                ticket.id
                              )}"
                            >
                              <i class="fas fa-times mr-1 text-bittersweet"></i>
                              Kapat
                            </a>
                          {/if}

                          <a
                            class="dropdown-item"
                            href="javascript:void(0);"
                            on:click="{onShowDeleteTicketModalClick(ticket.id)}"
                          >
                            <i class="fas fa-trash text-danger mr-1"></i>
                            Sil
                          </a>
                        </div>
                      </div>
                    </div>
                  </th>
                  <td class="align-middle text-nowrap">
                    <a
                      href="{base}/tickets/ticket/{ticket.id}"
                      title="Talebi Görüntüle"
                    >
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
                      href="{base}/players/player/{ticket.writer.username}"
                      use:tooltip="{[
                        ticket.writer.username,
                        { placement: 'top' },
                      ]}"
                    >
                      <img
                        src="https://minotar.net/avatar/{ticket.writer
                          .username}/32"
                        alt="Oyuncu Adı"
                        class="rounded-circle border"
                        height="32"
                        width="32"
                      />
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
        page="{data.page}"
        totalPage="{data.total_page}"
        on:firstPageClick="{() => reloadData(1)}"
        on:lastPageClick="{() => reloadData(data.total_page)}"
        on:pageLinkClick="{(event) => reloadData(event.detail.page)}"
      />
    </div>
  </div>
</article>

<ConfirmCloseTicketModal />
<ConfirmDeleteTicketModal />

<script context="module">
  import { browser } from "$app/env";
  import { writable, get } from "svelte/store";

  import ApiUtil from "$lib/api.util";
  import { showNetworkErrorOnCatch } from "$lib/store";

  let refreshable = false;
  let checkedList = writable([]);

  export const PageTypes = Object.freeze({
    ALL: "all",
    WAITING_REPLY: "waitingReply",
    CLOSED: "closed",
  });

  export const DefaultPageType = PageTypes.ALL;

  export function getStatusFromPageType(pageType) {
    return pageType === PageTypes.ALL
      ? 2
      : pageType === PageTypes.WAITING_REPLY
      ? 1
      : 3;
  }

  async function loadData(page, pageType) {
    return new Promise((resolve, reject) => {
      ApiUtil.post("panel/initPage/ticketPage", {
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
          tickets_count: 0,
          tickets: [],
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
          output.props.data = data;
        })
        .catch((errorCode) => {
          if (!!errorCode && errorCode === "PAGE_NOT_FOUND") {
            return null;
          }
        });
    }

    if (page.path === session.loadedPath && !refreshable) {
      if (browser) refreshable = true;

      output.props.data = session.data;

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

  import Pagination from "../components/Pagination.svelte";
  import TicketStatus from "../components/TicketStatus.svelte";
  import Date from "../components/Date.svelte";

  import ConfirmCloseTicketModal, {
    setCallback as setCloseTicketModalCallback,
    show as showCloseTicketModal,
    onHide as onConfirmCloseTicketModalHide,
  } from "../components/modals/ConfirmCloseTicketModal.svelte";
  import ConfirmDeleteTicketModal, {
    setCallback as setDeleteTicketModalCallback,
    show as showDeleteTicketModal,
    onHide as onConfirmDeleteTicketModalHide,
  } from "../components/modals/ConfirmDeleteTicketModal.svelte";

  export let data;

  let firstLoad = true;

  function reloadData(page = data.page, pageType = data.pageType) {
    showNetworkErrorOnCatch((resolve, reject) => {
      loadData(page, pageType)
        .then((loadedData) => {
          resolve();

          if (page !== data.page) {
            goto(base + "/tickets/" + data.pageType + "/" + page);
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

  function getListOfChecked(list) {
    const result = Object.keys(list).filter((key) => list[key]);

    if (result.length > 0) firstLoad = false;

    return result;
  }

  function onSelectAllClick() {
    const isAllSelected = isAllTicketsSelected(data.tickets, $checkedList);

    data.tickets.forEach((ticket) => {
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
        (data.tickets[
          data.tickets.indexOf(
            data.tickets.find(
              (ticketInTickets) => ticketInTickets.id === parseInt(id)
            )
          )
        ].selected = true)
    );

    showDeleteTicketModal(getListOfChecked(get(checkedList)));
  }

  function onShowDeleteTicketModalClick(id) {
    data.tickets[
      data.tickets.indexOf(
        data.tickets.find((ticketInTickets) => ticketInTickets.id === id)
      )
    ].selected = true;

    showDeleteTicketModal([id]);
  }

  function onShowCloseTicketsModalClick() {
    getListOfChecked(get(checkedList)).forEach(
      (id) =>
        (data.tickets[
          data.tickets.indexOf(
            data.tickets.find(
              (ticketInTickets) => ticketInTickets.id === parseInt(id)
            )
          )
        ].selected = true)
    );

    showCloseTicketModal(getListOfChecked(get(checkedList)));
  }

  function onShowCloseTicketModalClick(id) {
    data.tickets[
      data.tickets.indexOf(
        data.tickets.find((ticketInTickets) => ticketInTickets.id === id)
      )
    ].selected = true;

    showCloseTicketModal([id]);
  }

  setDeleteTicketModalCallback((selectedTickets) => {
    Object.values(selectedTickets).forEach((id) => {
      $checkedList[id] = false;
    });

    reloadData();
  });

  onConfirmDeleteTicketModalHide((selectedTickets) => {
    Object.values(selectedTickets).forEach((id) => {
      data.tickets[
        data.tickets.indexOf(
          data.tickets.find(
            (ticketInTickets) => ticketInTickets.id === parseInt(id)
          )
        )
      ].selected = false;
    });
  });

  setCloseTicketModalCallback((selectedTickets) => {
    Object.values(selectedTickets).forEach((id) => {
      $checkedList[id] = false;
    });

    reloadData();
  });

  onConfirmCloseTicketModalHide((selectedTickets) => {
    Object.values(selectedTickets).forEach((id) => {
      data.tickets[
        data.tickets.indexOf(
          data.tickets.find(
            (ticketInTickets) => ticketInTickets.id === parseInt(id)
          )
        )
      ].selected = false;
    });
  });
</script>
