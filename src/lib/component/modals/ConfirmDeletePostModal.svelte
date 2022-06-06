<!-- Confirm Delete Post Modal -->
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
        {$post.status === 0
          ? "Bu yazıyı kalıcı olarak silmek istediğinizden emin misiniz?"
          : "Bu yazıyı çöp kutusuna taşımak istediğinizden emin misiniz?"}
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

  const dialogID = "confirmDeletePost";
  const post = writable({});

  let callback = (post) => {};
  let hideCallback = (post) => {};
  let modal;

  export function show(newPost) {
    post.set(newPost);

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
    hideCallback(get(post));

    modal.hide();
  }

  export function onHide(newCallback) {
    hideCallback = newCallback;
  }
</script>

<script>
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
      const bodyHandler = (body) => {
        if (body.result === "ok") {
          loading = false;

          hide();

          // if (get(post).status === 0)

          //TODO TOAST

          callback(get(post));

          resolve();
        } else refreshBrowserPage();
      }

      if (get(post).status === 0) {
        ApiUtil.delete({
          path:
            `/api/panel/posts/${get(post).id}`,
          CSRFToken: $session.CSRFToken,
        })
          .then(bodyHandler)
          .catch(() => {
            reject();
          });

        return
      }

      ApiUtil.put({
        path:
          `/api/panel/posts/${get(post).id}/status`,
        body: {
          to: "trash"
        },
        CSRFToken: $session.CSRFToken,
      })
        .then(bodyHandler)
        .catch(() => {
          reject();
        });
    });
  }
</script>
