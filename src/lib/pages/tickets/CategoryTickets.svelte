<!-- Tickets Page -->
<article class="container">
  <!-- Action Menu -->
  <PageActions>
    <a class="btn btn-link" role="button" href="{base}/tickets" slot="left">
      <i class="fas fa-arrow-left me-2"></i>
      {$_('pages.category-tickets.tickets')}
    </a>
    <div
      class:d-none="{firstLoad}"
      class="animate__animated animate__faster {getListOfChecked($checkedList)
          .length > 0
          ? 'animate__slideInUp'
          : 'animate__slideOutDown'}
      faster" slot="right">
      <a
        class="btn btn-link link-danger"
        class:disabled="{getListOfChecked($checkedList).length === 0}"
        role="button"
        href="javascript:void(0);"
        on:click="{onShowDeleteTicketsModalClick}">
        <i class="fas fa-trash me-2"></i>
        {$_('pages.category-tickets.delete')}
      </a>
      <a
        class="btn btn-danger"
        class:disabled="{getListOfChecked($checkedList).length === 0}"
        role="button"
        href="javascript:void(0);"
        on:click="{onShowCloseTicketsModalClick}">
        <i class="fas fa-times me-2"></i>
        {$_('pages.category-tickets.close-ticket')}
      </a>
    </div>

  </PageActions>

  <!-- All Tickets -->
  <div class="card">
    <div class="card-body">
      <div class="row justify-content-between pb-3 align-items-center">
        <div class="col-md-auto col-12 text-md-left text-center">
          <h5 class="card-title mb-md-0">
            {$_('pages.category-tickets.table-title', {values: {ticketCount: data.ticketCount
              }}) + (getListOfChecked($checkedList).length > 0
              ? ", " + $_('pages.category-tickets.amount-selected', {values: {amount: getListOfChecked($checkedList).length}})
              : "")}
          </h5>
        </div>
      </div>

      <!-- No Tickets -->
      {#if data.ticketCount === 0}
        <NoContent />
      {:else}
        <!-- Tickets Table -->
        <div class="table-responsive">
          <table class="table table-hover mb-0">
            <thead>
              <tr>
                <th class="text-nowrap align-middle" scope="col">
                  <div class="form-check">
                    <input
                      class="form-check-input"
                      on:click="{onSelectAllClick}"
                      checked="{isAllTicketsSelected(
                        data.tickets,
                        $checkedList
                      )}"
                      id="selectAll"
                      type="checkbox" />
                  </div>
                </th>
                <th class="align-middle" scope="col">{$_('pages.category-tickets.table.title')}</th>
                <th class="align-middle" scope="col">{$_('pages.category-tickets.table.status')}</th>
                <th class="align-middle table-primary" scope="col">{$_('pages.category-tickets.table.category')}</th>
                <th class="align-middle" scope="col">{$_('pages.category-tickets.table.player')}</th>
                <th class="align-middle" scope="col">{$_('pages.category-tickets.table.last-reply')}</th>
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
                    onShowDeleteTicketModalClick(event.detail.id)}" />
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
</article>

<script context="module">
  import { writable, get } from "svelte/store";

  import ApiUtil from "$lib/api.util";
  import { showNetworkErrorOnCatch } from "$lib/Store";
  import { error } from "@sveltejs/kit";

  let checkedList = writable([]);

  async function loadData({ page, url, request }) {
    return new Promise((resolve, reject) => {
      ApiUtil.get({
        path: `/api/panel/tickets?page=${page}&categoryUrl=${url}`,
        request,
      }).then((body) => {
        if (body.result === "ok") {
          const data = body;

          data.page = parseInt(page);
          data.url = url;

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
  export async function load(event) {
    const { parent } = event;
    const parentData = await parent();

    let data = {
      ticketCount: 0,
      tickets: [],
      totalPage: 1,
      page: 1,
      url: event.params.url,
      category: {
        id: -1,
        title: "-",
        description: "",
        url: "-",
      },
    };

    if (parentData.NETWORK_ERROR) {
      return data;
    }

    await loadData({
      page: event.params.page || 1,
      url: event.params.url,
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
    setCallback as setCloseTicketModalCallback,
    show as showCloseTicketModal,
    onHide as onConfirmCloseTicketModalHide,
  } from "$lib/component/modals/ConfirmCloseTicketModal.svelte";
  import {
    setCallback as setDeleteTicketModalCallback,
    show as showDeleteTicketModal,
    onHide as onConfirmDeleteTicketModalHide,
  } from "$lib/component/modals/ConfirmDeleteTicketModal.svelte";

  import TicketRow from "$lib/component/rows/TicketRow.svelte";
  import NoContent from "$lib/component/NoContent.svelte";
  import PageActions from "$lib/component/PageActions.svelte";

  export let data;

  const pageTitle = getContext("pageTitle");

  let firstLoad = true;

  $: {
    pageTitle.set($_('pages.category-tickets.title', {values: {category: data.category.title === "-" ? $_('pages.category-tickets.no-category') : data.category.title}}));
  }

  function reloadData(page = data.page, url = data.url) {
    showNetworkErrorOnCatch((resolve, reject) => {
      loadData({ page, url })
        .then((loadedData) => {
          resolve();

          if (page !== data.page) {
            goto(base + "/tickets/category/" + data.url + "/" + page);
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
