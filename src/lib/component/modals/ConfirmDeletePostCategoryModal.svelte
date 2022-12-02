<!-- Post Category Delete Confirmation Modal -->
<div
  aria-hidden="true"
  class="modal fade"
  id="{dialogID}"
  role="dialog"
  tabindex="-1">
  <div class="modal-dialog modal-dialog-centered" role="dialog">
    <div class="modal-content">
      <div class="modal-body text-center">
        <div class="pb-3">
          <i class="fas fa-question-circle fa-3x d-block m-auto text-gray"></i>
        </div>
        Bu kategoriyi kalıcı olarak silmek istediğinizden emin misiniz?
        {#if $category.postCount !== 0}
          <div class="mt-3 alert alert-warning text-left">
            Kategori içerisindeki şu yazılar Kategorisiz olarak değişecek:
            <br />
            <br />
            {#each $category.posts as post, index (post)}
              <a
                class="badge bg-warning rounded-pill"
                href="{base}/posts/post/{post.id}"
                target="_blank">
                {post.title}
              </a>
            {/each}
          </div>
          {#if $category.postCount > 5}
            +{$category.postCount - 5}
            yazı daha
          {/if}
        {/if}
      </div>
      <div class="modal-footer flex-nowrap">
        <button
          class="btn btn-link col-6 m-0"
          type="button"
          class:disabled="{loading}"
          disabled="{loading}"
          on:click="{hide}">
          İptal
        </button>
        <button
          class="btn btn-danger col-6 m-0"
          type="button"
          class:disabled="{loading}"
          disabled="{loading}"
          on:click="{onYesClick}">
          Evet
        </button>
      </div>
    </div>
  </div>
</div>

<script context="module">
  import { writable, get } from "svelte/store";

  const dialogID = "postCategoryDeleteConfirmationModal";
  const category = writable({
    posts: [],
  });

  let callback = (category) => {};
  let hideCallback = (category) => {};
  let modal;

  export function show(newCategory) {
    category.set(newCategory);

    modal = new window.bootstrap.Modal(document.getElementById(dialogID), {
      backdrop: "static",
      keyboard: false,
    });
    modal.show();
  }

  export function setCallback(newCallback) {
    callback = newCallback;
  }

  export function hide() {
    hideCallback(get(category));

    modal.hide();
  }

  export function onHide(newCallback) {
    hideCallback = newCallback;
  }
</script>

<script>
  import { base } from "$app/paths";

  import { showNetworkErrorOnCatch } from "$lib/Store";
  import ApiUtil from "$lib/api.util";

  import {
    show as showToast,
    limitTitle,
  } from "$lib/component/ToastContainer.svelte";
  import PostCategoryDeletedPermanentlyToast from "$lib/component/toasts/PostCategoryDeletedPermanentlyToast.svelte";

  let loading = false;

  function refreshBrowserPage() {
    location.reload();
  }

  function onYesClick() {
    loading = true;

    showNetworkErrorOnCatch((resolve, reject) => {
      ApiUtil.delete({
        path: `/api/panel/post/categories/${get(category).id}`
      })
        .then((body) => {
          if (body.result === "ok") {
            loading = false;

            hide();

            showToast(PostCategoryDeletedPermanentlyToast, {
              title: get(category).title,
            });

            callback(get(category));

            resolve();
          } else refreshBrowserPage();
        })
        .catch(() => {
          reject();
        });
    });
  }
</script>
