<tr class:table-primary="{post.selected}">
  <th scope="row">
    <div class="dropdown position-static">
      <a
        role="button"
        href="javascript:void(0);"
        class="btn btn-sm btn-link"
        data-bs-toggle="dropdown"
        title="Eylemler">
        <span class="fas fa-ellipsis-v"></span>
      </a>
      <div
        class="dropdown-menu dropdown-menu-start animate__animated animate__fadeIn">
        <a
          class="dropdown-item"
          target="_blank"
          href="{UI_URL}/preview/post/{post.id}">
          <i class="fas fa-eye me-2"></i>
          Görüntüle
        </a>
        {#if pageType !== PageTypes.DRAFT}
          <a
            class="dropdown-item"
            href="javascript:void(0);"
            on:click="{onMoveToDraft}"
            class:disabled="{buttonsLoading}"
            disabled="{buttonsLoading}">
            <span>
              <i class="fa-solid fa-floppy-disk me-2"></i>
              Taslaklara Taşı
            </span>
          </a>
        {/if}

        {#if pageType !== PageTypes.PUBLISHED}
          <a
            class="dropdown-item"
            href="javascript:void(0);"
            class:disabled="{buttonsLoading}"
            disabled="{buttonsLoading}"
            on:click="{onPublishClick}">
            <span>
              <i class="fas fa-globe-americas me-2"></i>
              Yayınla
            </span>
          </a>
        {/if}

        <a
          class="dropdown-item link-danger"
          href="javascript:void(0);"
          on:click="{onDeletePostClick}">
          <i class="fas fa-trash me-2"></i>
          Sil
        </a>
      </div>
    </div>
  </th>
  <td class="align-middle text-nowrap">
    <a href="{base + '/posts/post/' + post.id}" title="Düzenle">
      {post.title}
    </a>
  </td>
  <td class="align-middle text-nowrap">
    <a href="{base}/posts/category/{post.category.url}">
      <span
        class="badge bg-light text-black rounded-pill"
        class:text-dark="{post.category.title === '-'}"
        style="{post.category.title === '-'
          ? ''
          : 'background: #' + post.category.color}">
        {post.category.title === "-" ? "Kategorisiz" : post.category.title}
      </span>
    </a>
  </td>
  <td class="align-middle text-nowrap">{post.views}</td>
  <td class="align-middle text-nowrap">
    <a
      href="{base}/players/player/{post.writer.username}"
      use:tooltip="{[post.writer.username, { placement: 'bottom' }]}">
      <img
        alt="{post.writer.username}"
        class="rounded-circle"
        height="32"
        src="https://minotar.net/avatar/{post.writer.username}"
        width="32" />
    </a>
  </td>
  <td class="align-middle text-nowrap">
    <Date time="{post.date}" />
  </td>
</tr>

<script>
  import { createEventDispatcher } from "svelte";

  import { base } from "$app/paths";

  import Date from "$lib/component/Date.svelte";

  import tooltip from "$lib/tooltip.util";
  import { UI_URL } from "$lib/variables";

  import { PageTypes } from "$lib/pages/Posts.svelte";

  export let post;
  export let pageType;
  export let buttonsLoading;

  const dispatch = createEventDispatcher();

  function onMoveToDraft() {
    dispatch("moveToDraft", { id: post.id });
  }

  function onPublishClick() {
    dispatch("publish", { id: post.id });
  }

  function onDeletePostClick() {
    dispatch("deletePost", { post });
  }
</script>
