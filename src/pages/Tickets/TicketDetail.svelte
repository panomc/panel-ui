<script>
  import Icon from "svelte-awesome";
  import {
    faTrash,
    faTimes,
    faArrowLeft,
    faEllipsisV,
  } from "@fortawesome/free-solid-svg-icons";

  import { route } from "routve";
  import moment from "moment";
  import { writable, get } from "svelte/store";
  import { onMount } from "svelte";
  import Quill from "quill";

  import { isPageInitialized, showNetworkErrorOnCatch } from "../../Store";
  import ApiUtil from "../../pano/js/api.util";
  import tooltip from "../../pano/js/tooltip.util";

  import ConfirmCloseTicketModal, {
    setCallback as setCloseTicketModalCallback,
    show as showCloseTicketModal,
  } from "../../components/modals/ConfirmCloseTicketModal.svelte";
  import ConfirmDeleteTicketModal, {
    setCallback as setDeleteTicketModalCallback,
    show as showDeleteTicketModal,
  } from "../../components/modals/ConfirmDeleteTicketModal.svelte";

  import TicketStatus from "../../components/TicketStatus.svelte";
  import Date from "../../components/Date.svelte";

  let title = "";
  let category = "-";
  let username = "";
  let status = 3;
  let count = 0;
  let messages = writable([]);
  let date = 0;

  let messagesSectionDiv;
  let page = 0;
  let loadMoreLoading = false;
  const messagesSectionClientHeight = writable(0);

  export let id = -1;

  function getTicketDetail(id) {
    showNetworkErrorOnCatch((resolve, reject) => {
      ApiUtil.post("panel/initPage/ticket/detail", { id: parseInt(id) })
        .then((response) => {
          if (response.data.result === "ok") {
            const ticket = response.data.ticket;

            title = ticket.title;
            category = ticket.category;
            username = ticket.username;
            status = ticket.status;
            count = ticket.count;
            messages.set(ticket.messages);
            date = ticket.date;

            isPageInitialized.set(true);
            prepareQuill();
          } else if (response.data.error === "NOT_EXISTS") {
            route("/panel/error-404");
          } else reject();
        })
        .catch(() => {
          reject();
        });
    });
  }

  function loadMore() {
    loadMoreLoading = true;

    showNetworkErrorOnCatch((resolve, reject) => {
      ApiUtil.post("panel/ticket/detail/message/page", {
        id: parseInt(id),
        last_message_id: get(messages)[0].id,
      })
        .then((response) => {
          if (response.data.result === "ok") {
            response.data.messages.reverse().forEach((message) => {
              messages.update((list) => {
                list.unshift(message);

                return list;
              });
            });

            loadMoreLoading = false;
          } else if (response.data.error === "NOT_EXISTS") {
            route("/panel/error-404");
          } else reject();
        })
        .catch(() => {
          reject();
        });
    });
  }

  setCloseTicketModalCallback(() => {
    getTicketDetail(id);
  });

  setDeleteTicketModalCallback(() => {
    route("/tickets");
  });

  messagesSectionClientHeight.subscribe((height) => {
    if (height !== 0 && messagesSectionDiv)
      messagesSectionDiv.scrollTo(0, height);
  });

  function imageHandler() {
    const range = quill.getSelection();
    const value = prompt("What is the image URL");

    if (value) {
      quill.insertEmbed(range.index, "image", value, Quill.sources.USER);
    }
  }

  function prepareQuill() {
    quill = new Quill("#editor", {
      modules: {
        toolbar: {
          container: "#editorToolbar",
          handlers: {
            image: imageHandler,
          },
        },
      },
      theme: "snow",
    });
  }

  let quill;

  onMount(() => {
    // quill.setHTML = (html) => {
    //   quill.container.firstChild.innerHTML = html;
    // };
    //
    // quill.getHTML = () => {
    //   return quill.container.firstChild.innerHTML;
    // };
    //
    // quill.on("text-change", () => {
    //   // post.text = quill.getHTML();
    // });
  });

  $: {
    getTicketDetail(id);
  }
</script>

<div class="row mb-3">
  <div class="col-auto">
    <a class="btn btn-link" role="button" href="/panel/tickets">
      <Icon data="{faArrowLeft}" class="mr-1" />
      Talepler
    </a>
  </div>
  <div class="col-auto ml-auto">
    {#if status !== 3}
      <a
        class="btn btn-bittersweet"
        role="button"
        on:click="{() => showCloseTicketModal([id])}"
        href="javascript:void(0);">
        Talebi Kapat
      </a>
    {/if}
    <a
      class="btn btn-outline-danger"
      role="button"
      href="javascript:void(0);"
      on:click="{() => showDeleteTicketModal([id])}">
      <Icon data="{faTrash}" class="mr-1" />
      Talebi Sil
    </a>
  </div>
</div>

<h3 class="text-muted badge badge-lightprimary panel-subtitle">Talep: #{id}</h3>

<div
  class="card border mb-3"
  class:border-secondary="{status === 1}"
  class:border-sunflower="{status === 2}"
  class:border-bittersweet="{status === 3}">
  <div class="card-body">
    <div class="row">
      <div class="col">
        <h5 class="card-title">{title}</h5>
        <a href="#">{username}</a> tarafından,
        <Date time="{date}" />,
        <a href="#">{category === "-" ? category : category.title}</a>
        kategorisine açıldı.
        <hr />
      </div>
      <div class="col-auto ml-auto">
        <TicketStatus status="{status}" />
      </div>
    </div>

    <div
      class="card-body messages-section"
      id="messageSection"
      bind:this="{messagesSectionDiv}"
      bind:clientHeight="{$messagesSectionClientHeight}">
      {#if $messages.length < count && count > 5 + 5 * page}
        <button
          class="btn text-primary bg-lightprimary d-block m-auto"
          class:disabled="{loadMoreLoading}"
          on:click="{loadMore}"
          >Eski Mesajları Göster ({count - $messages.length})
        </button>
      {/if}

      {#each $messages as message, index (message)}
        {#if message.panel}
          <div class="row py-3 flex-nowrap">
            <div class="col-2 d-flex justify-content-end"></div>
            <div
              class="col d-flex flex-nowrap justify-content-end align-items-center">
              <a
                class="btn btn-link mr-3 d-none"
                role="button"
                href="javascript:void(0);">
                <Icon data="{faEllipsisV}" />
              </a>
              <div class="d-inline-block p-2 bg-lightsecondary border rounded">
                <div class="pb-2 text-black">{@html message.message}</div>
                <small class="text-muted pt-2"
                  ><Date time="{message.date}" /></small>
              </div>
            </div>
            <div class="col-2">
              <a href="#">
                <img
                  src="https://minotar.net/avatar/{message.username}/48"
                  class="ml-3 border rounded-circle d-block mr-auto"
                  use:tooltip="{['bottom', message.username]}"
                  width="48"
                  height="48" />
              </a>
            </div>
          </div>
        {:else}
          <div class="row py-3 flex-nowrap">
            <div class="col-2 text-right">
              <a href="#">
                <img
                  src="https://minotar.net/avatar/{message.username}/48"
                  class="mr-3 border rounded-circle"
                  use:tooltip="{['bottom', message.username]}"
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
                <Icon data="{faEllipsisV}" />
              </a>
            </div>
            <div class="col-2"></div>
          </div>
        {/if}
      {/each}
    </div>
  </div>
</div>

{#if status === 3}
  <div class="container text-center">
    <Icon data="{faTimes}" scale="3" class="text-glass m-3" />
    <p class="text-gray">Bu talep kapalı.</p>
  </div>
{/if}

<div class="card" class:d-none="{status === 3}">
  <div class="card-body">
    <div class="row">
      <div class="col-auto d-flex flex-column">
        <!-- Editor -->
        <div id="editorToolbar">
          <span class="ql-formats"> <select class="ql-size"></select> </span>
          <span class="ql-formats">
            <button class="ql-bold"></button>
            <button class="ql-italic"></button>
            <button class="ql-underline"></button>
            <button class="ql-strike"></button>
          </span>
          <span class="ql-formats">
            <select class="ql-color"></select>
            <select class="ql-background"></select>
          </span>
          <span class="ql-formats">
            <button class="ql-header" value="1"></button>
            <button class="ql-header" value="2"></button>
            <button class="ql-blockquote"></button>
            <button class="ql-code-block"></button>
          </span>
          <span class="ql-formats">
            <button class="ql-list" value="ordered"></button>
            <button class="ql-list" value="bullet"></button>
            <button class="ql-indent" value="-1"></button>
            <button class="ql-indent" value="+1"></button>
          </span>
          <span class="ql-formats">
            <button class="ql-direction" value="rtl"></button>
            <select class="ql-align"></select>
          </span>
          <span class="ql-formats">
            <button class="ql-link"></button>
            <button class="ql-image"></button>
            <button class="ql-video"></button>
          </span>
        </div>

        <div id="editor"></div>
        <!-- Editor End -->
      </div>
      <div class="col">
        <button class="btn btn-block btn-primary mt-lg-0 mt-3">Gönder</button>
      </div>
    </div>
  </div>
</div>

<ConfirmCloseTicketModal />
<ConfirmDeleteTicketModal />
