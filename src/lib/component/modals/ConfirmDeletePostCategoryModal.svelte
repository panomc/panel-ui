<!-- Post Category Delete Confirmation Modal -->
<div
  aria-hidden="true"
  class="modal fade"
  id="{dialogID}"
  role="dialog"
  tabindex="-1"
>
  <div class="modal-dialog modal-dialog-centered" role="dialog">
    <div class="modal-content">
      <div class="modal-body text-center">
        <div class="pb-3">
          <i class="fas fa-question-circle fa-3x d-block m-auto text-gray"></i>
        </div>
        Bu kategoriyi kalıcı olarak silmek istediğinizden emin misiniz?
        {#if $category.post_count !== 0}
          <div class="mt-3 alert alert-warning text-left">
            Kategori içerisindeki şu yazılar Kategorisiz olarak değişecek:
            <br />
            <br />
            {#each $category.posts as post, index (post)}
              <a
                class="badge badge-warning badge-pill mr-1"
                href="{base}/posts/post/{post.id}"
                target="_blank"
              >
                {post.title}
              </a>
            {/each}
          </div>
          {#if $category.post_count > 5}
            +{$category.post_count - 5}
            yazı daha
          {/if}
        {/if}
      </div>
      <div class="modal-footer">
        <button
          class="btn btn-link text-muted"
          type="button"
          class:disabled="{loading}"
          disabled="{loading}"
          on:click="{hide}"
        >
          İptal
        </button>
        <button
          class="btn btn-danger"
          type="button"
          class:disabled="{loading}"
          disabled="{loading}"
          on:click="{onYesClick}"
        >
          Evet
        </button>
      </div>
    </div>
  </div>
</div>

<script context="module">
  import jquery from "jquery";
  import { writable, get } from "svelte/store";

  const dialogID = "postCategoryDeleteConfirmationModal";
  const category = writable({
    posts: [],
  });

  let callback = (category) => {};
  let hideCallback = (category) => {};

  export function show(newCategory) {
    category.set(newCategory);

    jquery("#" + dialogID).modal({ backdrop: "static", keyboard: false });
  }

  export function setCallback(newCallback) {
    callback = newCallback;
  }

  export function hide() {
    hideCallback(get(category));

    jquery("#" + dialogID).modal("hide");
  }

  export function onHide(newCallback) {
    hideCallback = newCallback;
  }
</script>

<script>
  import { base } from "$app/paths";
  import { session } from "$app/stores";

  import { showNetworkErrorOnCatch } from "$lib/store";
  import ApiUtil from "$lib/api.util";

  let loading = false;

  function refreshBrowserPage() {
    location.reload();
  }

  function onYesClick() {
    loading = true;

    showNetworkErrorOnCatch((resolve, reject) => {
      ApiUtil.post({
        path: "/api/panel/post/category/delete",
        body: {
          id: get(category).id,
        },
        CSRFToken: $session.CSRFToken,
      })
        .then((body) => {
          if (body.result === "ok") {
            loading = false;

            hide();

            //TODO TOAST

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
