<script context="module">
  import jquery from "jquery";
  import { writable, get } from "svelte/store";

  const dialogID = "postCategoryDeleteConfirmationModal";
  const category = writable({
    posts: [],
  });

  let callback = (category) => {};

  export function show(newCategory) {
    category.set(newCategory);

    jquery("#" + dialogID).modal({backdrop: 'static', keyboard: false});
  }

  export function setCallback(newCallback) {
    callback = newCallback;
  }

  export function hide() {
    jquery("#" + dialogID).modal("hide");
  }
</script>

<script>
  import Icon from "svelte-awesome";
  import { faQuestionCircle } from "@fortawesome/free-solid-svg-icons";

  import { showNetworkErrorOnCatch } from "../../Store";
  import ApiUtil from "../../pano/js/api.util";

  let loading = false;

  function refreshBrowserPage() {
    location.reload();
  }

  function onYesClick() {
    showNetworkErrorOnCatch((resolve, reject) => {
      ApiUtil.post("panel/post/category/delete", {
        id: get(category).id,
      })
        .then((response) => {
          if (response.data.result === "ok") {
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
          <Icon
            data="{faQuestionCircle}"
            scale="3"
            class="d-block m-auto text-gray"
          />
        </div>
        {#if $category.post_count !== 0}
          Not: Eğer bu kategoriyi silerseniz, şu yazılar kategorisiz olarak
          kalacaklardır:
          <br />
          <br />

          {#each $category.posts as post, index (post)}
            <a href="/panel/posts/post/{post.id}" target="_blank">
              {post.title}
            </a>
            <br />
          {/each}

          {#if $category.post_count > 5}
            +{$category.post_count - 5} yazı daha
          {/if}

          <br />
        {/if}
        Bu kategoriyi kalıcı olarak silmek istediğinizden emin misiniz?
      </div>
      <div class="modal-footer">
        <button
          class="btn btn-link text-muted"
          data-dismiss="modal"
          type="button"
          class:disabled="{loading}"
          disabled="{loading}"
        >
          Hayır
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
