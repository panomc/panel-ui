<style global>
  .messages-section {
    overflow-y: auto;
    max-height: 450px;
  }

  .message-balloon > p {
    margin: 0;
    padding: 0;
  }
</style>

<article class="container">
  <div
    class="row justify-content-between mb-3 animate__animated animate__slideInUp">
    <div class="col-auto">
      <a class="btn btn-link" role="button" href="{base}/tickets">
        <i class="fas fa-arrow-left me-2"></i>
        Talepler
      </a>
    </div>
    <div class="col-auto ml-auto">
      <a
        class="btn btn-link link-danger"
        role="button"
        href="javascript:void(0);"
        on:click="{() => showDeleteTicketModal([data.ticket.id])}">
        <i class="fas fa-trash"></i>
      </a>
      {#if data.ticket.status !== TicketStatuses.CLOSED}
        <a
          class="btn btn-bittersweet"
          role="button"
          on:click="{() => showCloseTicketModal([data.ticket.id])}"
          href="javascript:void(0);">
          <i class="fas fa-check me-2"></i> Talebi Kapat
        </a>
      {/if}
    </div>
  </div>

  <div class="card mb-3">
    <div
      class="card-header bg-opacity-25 pt-3"
      class:bg-secondary="{data.ticket.status === TicketStatuses.NEW}"
      class:bg-sunflower="{data.ticket.status === TicketStatuses.REPLIED}"
      class:bg-bittersweet="{data.ticket.status === TicketStatuses.CLOSED}">
      <div class="row">
        <div class="col">
          <h5 class="card-title">{data.ticket.title}</h5>
          <small>
            <a href="{base}/players/player/{data.ticket.username}"
              >{data.ticket.username}</a>
            tarafından,
            <Date time="{data.ticket.date}" />,
            <a href="{base}/tickets/category/{data.ticket.category.url}"
              >{data.ticket.category.title === "-"
                ? "Kategorisiz"
                : data.ticket.category.title}</a>
            kategorisine açıldı.</small>
        </div>
        <div class="col-auto">
          <TicketStatus status="{data.ticket.status}" />
        </div>
      </div>
    </div>
    <div
      class="card-body messages-section"
      id="messageSection"
      bind:this="{messagesSectionDiv}"
      bind:clientHeight="{$messagesSectionClientHeight}">
      {#if data.ticket.messages.length < data.ticket.count && data.ticket.count > 5}
        <button
          class="btn btn-link bg-light d-block m-auto"
          class:disabled="{loadMoreLoading}"
          on:click="{loadMore}"
          ><i class="fas fa-arrow-up me-2"></i> Önceki Mesajlar ({data.ticket
            .count -
            (data.ticket.messages.length - sentMessageCount)})
        </button>
      {/if}

      {#each data.ticket.messages as message, index (message)}
        {#if message.panel}
          <div class="row py-2 flex-nowrap justify-content-end">
            <div class="col-auto d-flex align-items-center">
              <!-- <a
                  class="btn btn-link btn-sm text-gray"
                  role="button"
                  href="javascript:void(0);">
                  <i class="fas fa-ellipsis-v"></i>
                </a> -->
              <Date time="{message.date}">
                <div class="message-balloon p-2 rounded bg-primary text-white">
                  {@html message.message}
                </div>
              </Date>
            </div>
            <div class="col-auto">
              <a href="{base}/players/player/{message.username}">
                <img
                  src="https://crafthead.net/avatar/{message.username}/48"
                  alt="{message.username}"
                  class="rounded-circle d-block mr-auto animate__animated animate__zoomIn"
                  use:tooltip="{[message.username, { placement: 'bottom' }]}"
                  width="48"
                  height="48" />
              </a>
            </div>
          </div>
        {:else}
          <div class="row py-2 flex-nowrap justify-content-start">
            <div class="col-auto text-right">
              <a href="{base}/players/player/{message.username}">
                <img
                  src="https://crafthead.net/avatar/{message.username}/48"
                  alt="{message.username}"
                  class="rounded-circle animate__animated animate__zoomIn"
                  use:tooltip="{[message.username, { placement: 'bottom' }]}"
                  width="48"
                  height="48" />
              </a>
            </div>
            <div class="col-auto d-flex flex-nowrap align-items-center">
              <Date time="{message.date}">
                <div
                  class="message-balloon p-2 rounded d-inline-block bg-light">
                  {message.message}
                </div>
              </Date>
              <a
                class="btn btn-link d-none me-2"
                role="button"
                href="javascript:void(0);">
                <i class="fas fa-ellipsis-v"></i>
              </a>
            </div>
          </div>
        {/if}
      {/each}
    </div>
  </div>

  {#if data.ticket.status === TicketStatuses.CLOSED}
    <div class="container text-center">
      <i class="fas fa-times fa-3x text-dark text-opacity-25 m-3"></i>
      <p class="text-gray">Bu talep kapalı.</p>
    </div>
  {/if}

  <!-- Send Message Section -->
  <div
    class="card animate__animated animate__fadeIn animate__slower"
    class:d-none="{data.ticket.status === TicketStatuses.CLOSED}">
    <div class="card-body">
      <div class="row align-items-end">
        <div class="col d-flex flex-column">
          <!-- Editor -->
          <Editor bind:content="{messageText}" bind:isEmpty="{isEditorEmpty}" />
          <!-- Editor End -->
        </div>
        <div class="col-auto">
          <button
            class="btn btn-secondary mt-lg-0 mt-3"
            on:click="{sendMessage}"
            class:disabled="{messageSendLoading || isEditorEmpty}"
            :disabled="{messageSendLoading || isEditorEmpty}">
            <i class="fas fa-paper-plane"></i>
            <span class="d-lg-inline d-none ms-2">Gönder</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</article>

<script context="module">
  import { writable } from "svelte/store";

  import ApiUtil from "$lib/api.util.js";
  import { showNetworkErrorOnCatch } from "$lib/store.js";

  import { TicketStatuses } from "$lib/component/TicketStatus.svelte";
  import Editor from "$lib/component/Editor.svelte";

  async function loadTicket({ id, request, CSRFToken }) {
    return new Promise((resolve, reject) => {
      ApiUtil.get({
        path: `/api/panel/tickets/${id}`,
        request,
        CSRFToken,
      }).then((body) => {
        if (body.result === "ok") {
          const ticket = body.ticket;

          ticket.id = parseInt(id);

          resolve(ticket);
        } else {
          reject(body);
        }
      });
    });
  }

  // async function loadCategories() {
  //   return new Promise((resolve, reject) => {
  //     ApiUtil.get("panel/post/category/categories")
  //       .then((response) => {
  //         if (response.data.result === "ok") {
  //           const data = response.data;
  //
  //           resolve(data);
  //         } else if (response.data.result === "error") {
  //           const errorCode = response.data.error;
  //
  //           reject(errorCode, response.data);
  //         }
  //       })
  //       .catch((e) => {
  //         console.log(e);
  //       });
  //   });
  // }

  /**
   * @type {import('@sveltejs/kit').Load}
   */
  export async function load(request) {
    let output = {
      props: {
        data: {
          ticket: {
            id: -1,
            title: "",
            category: "-",
            username: "",
            status: TicketStatuses.NEW,
            count: 0,
            messages: [],
            date: 0,
          },
        },
      },
    };

    if (request.stuff.NETWORK_ERROR) {
      output.props.data.NETWORK_ERROR = true;

      return output;
    }

    await loadTicket({ id: request.params.id, request })
      .then((body) => {
        output.props.data.ticket = body;
      })
      .catch((body) => {
        if (body.error === "NOT_EXISTS") {
          output = null;
        }
      });

    return output;
  }
</script>

<script>
  import { afterUpdate, onMount } from "svelte";
  import { goto } from "$app/navigation";
  import { base } from "$app/paths";
  import { session, page } from "$app/stores";

  import tooltip from "$lib/tooltip.util.js";

  import {
    setCallback as setCloseTicketModalCallback,
    show as showCloseTicketModal,
  } from "$lib/component/modals/ConfirmCloseTicketModal.svelte";
  import {
    setCallback as setDeleteTicketModalCallback,
    show as showDeleteTicketModal,
  } from "$lib/component/modals/ConfirmDeleteTicketModal.svelte";

  import Date from "$lib/component/Date.svelte";
  import TicketStatus from "$lib/component/TicketStatus.svelte";

  export let data;

  if (data.NETWORK_ERROR) {
    showNetworkErrorOnCatch((resolve, reject) => {
      loadTicket({ id: $page.params.id, CSRFToken: $session.CSRFToken })
        .then((loadedData) => {
          data.ticket = loadedData;

          resolve();
        })
        .catch((body) => {
          if (body.error === "NOT_EXISTS") {
            goto(base + "/error-404");

            resolve();
          } else {
            reject();
          }
        });
    }, true);
  }

  let messagesSectionDiv;
  let loadMoreLoading = false;
  let messageSendLoading = false;

  let messageText = "";
  let isEditorEmpty = true;

  let shouldScroll = true;

  let sentMessageCount = 0;

  const messagesSectionClientHeight = writable(0);

  function loadMore() {
    loadMoreLoading = true;

    showNetworkErrorOnCatch((resolve, reject) => {
      ApiUtil.get({
        path: `/api/panel/tickets/${data.ticket.id}/messages?lastMessageId=${data.ticket.messages[0].id}`,
        CSRFToken: $session.CSRFToken,
      })
        .then((body) => {
          if (body.result === "ok") {
            body.messages.reverse().forEach((message) => {
              data.ticket.messages.unshift(message);
            });

            data.ticket.messages = data.ticket.messages;

            loadMoreLoading = false;
          } else if (body.error === "NOT_EXISTS") {
            goto(base + "/error-404");
          } else reject();
        })
        .catch(() => {
          reject();
        });
    });
  }

  function sendMessage() {
    messageSendLoading = true;

    showNetworkErrorOnCatch((resolve, reject) => {
      ApiUtil.post({
        path: `/api/panel/tickets/${data.ticket.id}/message`,
        body: {
          message: messageText,
        },
        CSRFToken: $session.CSRFToken,
      })
        .then((body) => {
          if (body.result === "ok") {
            shouldScroll = true;

            data.ticket.messages.push(body.message);

            sentMessageCount++;

            data.ticket.status = TicketStatuses.REPLIED;
            messageText = "";

            messageSendLoading = false;

            resolve();
          } else if (body.error === "NOT_EXISTS") {
            goto(base + "/error-404");
          } else reject();
        })
        .catch(() => {
          reject();
        });
    });
  }

  setCloseTicketModalCallback(() => {
    data.ticket.status = TicketStatuses.CLOSED;
  });

  setDeleteTicketModalCallback(() => {
    goto(base + "/tickets");
  });

  afterUpdate(() => {
    if (shouldScroll && messagesSectionDiv.scrollHeight > 0) {
      messagesSectionDiv.scrollTo(0, messagesSectionDiv.scrollHeight);

      shouldScroll = false;
    }
  });

  onMount(() => {
    shouldScroll = true;
  });
</script>
