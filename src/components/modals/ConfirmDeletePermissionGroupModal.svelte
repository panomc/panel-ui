<script context="module">
  import jquery from "jquery";
  import { writable, get } from "svelte/store";

  const dialogID = "permissionGroupDeleteConfirmationModal";
  const permissionGroup = writable({
    id: -1,
    name: "",
    users: [],
    user_count: 0,
  });

  let callback = (permissionGroup) => {};
  let hideCallback = (permissionGroup) => {};

  export function show(newPermissionGroup) {
    permissionGroup.set(newPermissionGroup);

    jquery("#" + dialogID).modal({ backdrop: "static", keyboard: false });
  }

  export function setCallback(newCallback) {
    callback = newCallback;
  }

  export function hide() {
    hideCallback(get(permissionGroup));

    jquery("#" + dialogID).modal("hide");
  }

  export function onHide(newCallback) {
    hideCallback = newCallback;
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
    loading = true;

    showNetworkErrorOnCatch((resolve, reject) => {
      ApiUtil.post("panel/permission/delete/group", {
        id: get(permissionGroup).id,
      })
        .then((response) => {
          if (response.data.result === "ok") {
            loading = false;

            hide();

            //TODO TOAST

            callback(get(permissionGroup));

            resolve();
          } else refreshBrowserPage();
        })
        .catch(() => {
          reject();
        });
    });
  }
</script>

<!-- Permission Group Delete Confirmation Modal -->
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
          <Icon
            data="{faQuestionCircle}"
            scale="3"
            class="d-block m-auto text-gray" />
        </div>
        {#if $permissionGroup.user_count !== 0}
          Yetki grubu içerisindeki şu kullanıcılar <i>yetkisiz</i> olarak değişecek:
          <br />
          <br />
        </span>

            {#each $category.posts as post, index (post)}
                <a class="badge badge-warning badge-pill mr-1" href="/panel/posts/post/{post.id}" target="_blank">
                  {post.title}
                </a>
            {/each}
          </div>
          </div>

          <br />
        {/if}
        Bu yetki grubunu kalıcı olarak silmek istediğinizden emin misiniz?
      </div>
      <div class="modal-footer">
        <button
          class="btn btn-link text-muted"
          type="button"
          class:disabled="{loading}"
          disabled="{loading}"
          on:click="{hide}">
          İptal
        </button>
        <button
          class="btn btn-danger"
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
