<!-- Tickets Page -->
<article class="container">
  <!-- Action Menu -->
  <div
    class="row justify-content-between mb-3 animate__animated animate__slideInUp"
  >
    <div class="col-auto">
      <a class="btn btn-link" role="button" href="{base}/tickets/categories">
        <i class="fas fa-list-alt mr-1"></i>
        Talep Kategorileri
      </a>
    </div>
    <div class="col-auto">
      <div
        class:d-none="{firstLoad}"
        class="animate__animated {getListOfChecked($checkedList).length > 0
          ? 'animate__fadeIn'
          : 'animate__fadeOut'}
      faster"
      >
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
        <a
          class="btn btn-bittersweet"
          class:disabled="{getListOfChecked($checkedList).length === 0}"
          role="button"
          href="javascript:void(0);"
          on:click="{onShowCloseTicketsModalClick}"
        >
          <i class="fas fa-check mr-1"></i>
          Kapat
        </a>
      </div>
    </div>
  </div>

  <!-- All Tickets -->
  <div class="card">
    <div class="card-body">
      <div class="row justify-content-between pb-3 align-items-center">
        <div class="col-md-auto col-12 text-md-left text-center">
          <h5 class="card-title mb-md-0">
            {data.ticketCount}
            {data.pageType === PageTypes.WAITING_REPLY
              ? "Yeni"
              : data.pageType === PageTypes.CLOSED
              ? "Kapalı"
              : ""} Talep{getListOfChecked($checkedList).length > 0
              ? ", " + getListOfChecked($checkedList).length + " adet seçildi"
              : ""}
          </h5>
        </div>
        <div class="col-md-auto col-12 text-md-right text-center">
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
              class="btn btn-sm btn-outline-light btn-link text-mint"
              class:active="{data.pageType === PageTypes.WAITING_REPLY}"
              role="button"
              href="{base}/tickets/waitingReply"
            >
              Yeni
            </a>
            <a
              class="btn btn-sm btn-outline-light btn-link text-bittersweet"
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
      {#if data.ticketCount === 0}
        <div class="container text-center animate__animated animate__zoomIn">
          <i class="fas fa-ticket-alt fa-3x m-3 text-dark text-opacity-25"></i>
          <p class="text-gray">Burada içerik yok.</p>
        </div>
      {:else}
        <!-- Tickets Table -->
        <div class="table-responsive">
          <table class="table mb-0">
            <thead>
              <tr>
                <th class="align-middle" scope="col">
                  <div class="form-check">
                    <input
                      class="form-check-input"
                      on:click="{onSelectAllClick}"
                      checked="{isAllTicketsSelected(
                        data.tickets,
                        $checkedList
                      )}"
                      id="selectAll"
                      type="checkbox"
                    />
                  </div>
                </th>
                <th class="align-middle" scope="col">Başlık</th>
                <th class="align-middle" scope="col">Durum</th>
                <th class="align-middle" scope="col">Kategori</th>
                <th class="align-middle" scope="col">Açan</th>
                <th class="align-middle" scope="col">Son Yanıt</th>
              </tr>
            </thead>
            <tbody>
              {#each data.tickets as ticket, index (ticket)}
                <TicketRow
                  ticket="{ticket}"
                  checkedList="{checkedList}"
                  on:showCloseTicketModalClick="{(event) =>
                    onShowCloseTicketModalClick(event.detail.id)}"
                  on:showDeleteTicketModalClick="{(event) =>
                    onShowDeleteTicketModalClick(event.detail.id)}"
                />
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
        on:pageLinkClick="{(event) => reloadData(event.detail.page)}"
      />
    </div>
  </div>
</article>

<script context="module">
  import { writable, get } from "svelte/store";

  import ApiUtil from "$lib/api.util";
  import { showNetworkErrorOnCatch } from "$lib/store";

  let checkedList = writable([]);

  export const PageTypes = Object.freeze({
    ALL: "all",
    WAITING_REPLY: "waitingReply",
    CLOSED: "closed",
  });

  export const DefaultPageType = PageTypes.ALL;

  async function loadData({ page, pageType, request, CSRFToken }) {
    return new Promise((resolve, reject) => {
      ApiUtil.post({
        path: "/api/panel/initPage/ticketPage",
        body: {
          page: parseInt(page),
          pageType: pageType
        },
        request,
        CSRFToken,
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
   * @type {import('@sveltejs/kit').Load}
   */
  export async function load(request, pageType = DefaultPageType) {
    let output = {
      props: {
        data: {
          ticketCount: 0,
          tickets: [],
          totalPage: 1,
          page: 1,
          pageType,
        },
      },
    };

    if (request.stuff.NETWORK_ERROR) {
      output.props.data.NETWORK_ERROR = true;

      return output;
    }

    await loadData({ page: request.params.page || 1, pageType, request })
      .then((data) => {
        output.props.data = { ...output.props.data, ...data };
      })
      .catch((body) => {
        if (body.error === "PAGE_NOT_FOUND") output = null;
      });

    return output;
  }
</script>

<script>
  import { goto } from "$app/navigation";
  import { base } from "$app/paths";
  import { page, session } from "$app/stores";

  import { pageTitle } from "$lib/store";

  import Pagination from "$lib/component/Pagination.svelte";

  import {
    setCallback as setCloseTicketModalCallback,
    show as showCloseTicketModal,
    onHide as onConfirmCloseTicketModalHide,
  } from "$lib/component/modals/ConfirmCloseTicketModal.svelte";
  import {
    setCallback as setDeleteTicketModalCallback,
    show as showDeleteTicketModal,
    onHide as onConfirmDeleteTicketModalHide,
  } from "$lib/component/modals/ConfirmDeleteTicketModal.svelte";

  import TicketRow from "$lib/component/TicketRow.svelte";

  export let data;

  pageTitle.set(
    (data.pageType === PageTypes.WAITING_REPLY
      ? "Yeni" + " "
      : data.pageType === PageTypes.CLOSED
      ? "Kapalı" + " "
      : "") + "Talepler"
  );

  if (data.NETWORK_ERROR) {
    showNetworkErrorOnCatch((resolve, reject) => {
      loadData({
        page: $page.params.page || 1,
        pageType: data.pageType,
        CSRFToken: $session.CSRFToken,
      })
        .then((loadedData) => {
          data = loadedData;

          resolve();
        })
        .catch((body) => {
          if (body.error === "PAGE_NOT_FOUND") {
            goto(base + "/error-404");

            resolve();
          } else {
            reject();
          }
        });
    }, true);
  }

  let firstLoad = true;

  function reloadData(page = data.page, pageType = data.pageType) {
    showNetworkErrorOnCatch((resolve, reject) => {
      loadData({ page, pageType, CSRFToken: $session.CSRFToken })
        .then((loadedData) => {
          resolve();

          if (page !== data.page) {
            goto(base + "/tickets/" + data.pageType + "/" + page);
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
