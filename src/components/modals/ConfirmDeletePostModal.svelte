<script context="module">
  import jquery from "jquery";
  import { writable, get } from "svelte/store";

  const dialogID = "confirmDeletePost";
  const post = writable({});

  let callback = (post) => {};

  export function show(newPost) {
    post.set(newPost);

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
      ApiUtil.post(
        "panel/post/" + (get(post).status === 0 ? "delete" : "moveTrash"),
        {
          id: get(post).id,
        }
      )
        .then((response) => {
          if (response.data.result === "ok") {
            loading = false;

            hide();

            // if (get(post).status === 0)

            //TODO TOAST

            callback(get(post));

            resolve();
          } else refreshBrowserPage();
        })
        .catch(() => {
          reject();
        });
    });
  }
</script>

<!-- Confirm Delete Post Modal -->
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
        {$post.status === 0 ? 'Bu yazıyı kalıcı olarak silmek istediğinizden emin misiniz?' : 'Bu yazıyı çöp kutusuna taşımak istediğinizden emin misiniz?'}
      </div>
      <div class="modal-footer">
        <button
          class="btn btn-link text-muted"
          data-dismiss="modal"
          type="button"
          class:disabled="{loading}"
          disabled="{loading}"
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
