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
        Tüm bildirimleri kalıcı olarak silmek istediğinizden emin misiniz?
      </div>
      <div class="modal-footer">
        <button
          class="btn btn-link text-muted"
          type="button"
          class:disabled="{loading}"
          aria-disabled="{loading}"
          disabled="{loading}"
          on:click="{hide}">
          İptal
        </button>
        <button
          class="btn btn-danger"
          type="button"
          class:disabled="{loading}"
          aria-disabled="{loading}"
          disabled="{loading}"
          on:click="{onYesClick}">Evet</button>
      </div>
    </div>
  </div>
</div>

<script context="module">
  import jquery from "jquery";

  const dialogID = "confirmDeleteAllNotifications";

  let callback = () => {};
  let hideCallback = () => {};

  export function show() {
    jquery("#" + dialogID).modal({ backdrop: "static", keyboard: false });
  }

  export function setCallback(newCallback) {
    callback = newCallback;
  }

  export function hide() {
    hideCallback();

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
  import ApiUtil from "../../pano-ui/js/api.util";

  let loading;

  function refreshBrowserPage() {
    location.reload();
  }

  function onYesClick() {
    loading = true;

    showNetworkErrorOnCatch((resolve, reject) => {
      ApiUtil.post("panel/notifications/deleteAll")
        .then((response) => {
          if (response.data.result === "ok") {
            loading = false;

            hide();

            //TODO TOAST

            callback();

            resolve();
          } else refreshBrowserPage();
        })
        .catch(() => {
          reject();
        });
    });
  }
</script>
