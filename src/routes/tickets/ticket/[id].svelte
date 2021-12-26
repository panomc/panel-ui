<style>
  .messages-section {
    overflow-y: auto;
    max-height: 450px;
  }
</style>

<article class="container">
  <div class="row mb-3 animate__animated animate__slideInUp">
    <div class="col-auto">
      <a class="btn btn-link" role="button" href="{base}/tickets">
        <i class="fas fa-arrow-left mr-1"></i>
        Talepler
      </a>
    </div>
    <div class="col-auto ml-auto">
      {#if data.ticket.status !== TicketStatuses.CLOSED}
        <a
          class="btn btn-bittersweet"
          role="button"
          on:click="{() => showCloseTicketModal([data.ticket.id])}"
          href="javascript:void(0);">
          Talebi Kapat
        </a>
      {/if}
      <a
        class="btn btn-outline-danger"
        role="button"
        href="javascript:void(0);"
        on:click="{() => showDeleteTicketModal([data.ticket.id])}">
        <i class="fas fa-trash"></i>

        <span class="d-lg-inline d-none ml-1">Talebi Sil</span>
      </a>
    </div>
  </div>

  <h3
    class="text-muted badge badge-lightprimary panel-subtitle animate__animated animate__slideInLeft">
    Talep: #{data.ticket.id}
  </h3>

  <div
    class="card border mb-3"
    class:border-secondary="{data.ticket.status === TicketStatuses.NEW}"
    class:border-sunflower="{data.ticket.status === TicketStatuses.REPLIED}"
    class:border-bittersweet="{data.ticket.status === TicketStatuses.CLOSED}">
    <div class="card-body">
      <div class="row">
        <div class="col">
          <h5 class="card-title">{data.ticket.title}</h5>
          <a href="{base}/players/player/{data.ticket.username}"
            >{data.ticket.username}</a>
          tarafından,
          <Date time="{data.ticket.date}" />,
          <a href="#"
            >{data.ticket.category === "-"
              ? data.ticket.category
              : data.ticket.category.title}</a>
          kategorisine açıldı.
          <hr />
        </div>
        <div class="col-auto ml-auto">
          <TicketStatus status="{data.ticket.status}" />
        </div>
      </div>

      <div
        class="card-body messages-section"
        id="messageSection"
        bind:this="{messagesSectionDiv}"
        bind:clientHeight="{$messagesSectionClientHeight}">
        {#if data.ticket.messages.length < data.ticket.count && data.ticket.count > 5}
          <button
            class="btn text-primary bg-lightprimary d-block m-auto"
            class:disabled="{loadMoreLoading}"
            on:click="{loadMore}"
            >Eski Mesajları Göster ({data.ticket.count -
              (data.ticket.messages.length - sentMessageCount)})
          </button>
        {/if}

        {#each data.ticket.messages as message, index (message)}
          {#if message.panel}
            <div class="row py-3 flex-nowrap">
              <div class="col-2 d-flex justify-content-end"></div>
              <div
                class="col d-flex flex-nowrap justify-content-end align-items-center">
                <a
                  class="btn btn-link mr-3 d-none"
                  role="button"
                  href="javascript:void(0);">
                  <i class="fas fa-ellipsis-v"></i>
                </a>
                <div
                  class="d-inline-block p-2 bg-lightsecondary border rounded">
                  <div class="pb-2 text-black">{@html message.message}</div>
                  <small class="text-muted pt-2"
                    ><Date time="{message.date}" /></small>
                </div>
              </div>
              <div class="col-2">
                <a href="{base}/players/player/{message.username}">
                  <img
                    src="https://minotar.net/avatar/{message.username}/48"
                    alt="{message.username}"
                    class="ml-3 border rounded-circle d-block mr-auto"
                    use:tooltip="{[message.username, { placement: 'bottom' }]}"
                    width="48"
                    height="48" />
                </a>
              </div>
            </div>
          {:else}
            <div class="row py-3 flex-nowrap">
              <div class="col-2 text-right">
                <a href="{base}/players/player/{message.username}">
                  <img
                    src="https://minotar.net/avatar/{message.username}/48"
                    alt="{message.username}"
                    class="mr-3 border rounded-circle"
                    use:tooltip="{[message.username, { placement: 'bottom' }]}"
                    width="48"
                    height="48" />
                </a>
              </div>
              <div class="col d-flex flex-nowrap align-items-center">
                <div class="p-2 rounded bg-lightprimary border d-inline-block">
                  <div class="pb-2 text-black">
                    {message.message}
                  </div>
                  <small class="text-muted pt-2"
                    ><Date time="{message.date}" /></small>
                </div>
                <a
                  class="btn btn-link d-none ml-3"
                  role="button"
                  href="javascript:void(0);">
                  <i class="fas fa-ellipsis-v"></i>
                </a>
              </div>
              <div class="col-2"></div>
            </div>
          {/if}
        {/each}
      </div>
    </div>
  </div>

  {#if data.ticket.status === TicketStatuses.CLOSED}
    <div class="container text-center">
      <i class="fas fa-times fa-3x text-glass m-3"></i>
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
            class="btn btn-primary mt-lg-0 mt-3"
            on:click="{sendMessage}"
            class:disabled="{messageSendLoading || isEditorEmpty}"
            :disabled="{messageSendLoading || isEditorEmpty}">
            <i class="fas fa-paper-plane"></i>
            <span class="d-lg-inline d-none ml-1">Gönder</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</article>

<script context="module">
  import { writable } from "svelte/store";

  import ApiUtil from "$lib/api.util";
  import { showNetworkErrorOnCatch } from "$lib/store";

  import { TicketStatuses } from "$lib/component/TicketStatus.svelte";
  import Editor from "$lib/component/Editor.svelte";

  async function loadTicket({ id, request, CSRFToken }) {
    return new Promise((resolve, reject) => {
      ApiUtil.post({
        path: "/api/panel/initPage/ticket/detail",
        body: {
          id: parseInt(id),
        },
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

    await loadTicket({ id: request.page.params.id, request })
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

  import tooltip from "$lib/tooltip.util";

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
      ApiUtil.post({
        path: "/api/panel/ticket/detail/message/page",
        body: {
          id: parseInt(data.ticket.id),
          last_message_id: data.ticket.messages[0].id,
        },
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
        path: "/api/panel/ticket/detail/message/send",
        body: {
          ticket_id: parseInt(data.ticket.id),
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
