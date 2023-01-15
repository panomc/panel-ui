<!-- Confirm Remove Server Modal -->
<div
  aria-hidden="true"
  class="modal fade"
  id="{dialogID}"
  role="dialog"
  tabindex="-1">
  <div class="modal-dialog modal-dialog-centered" role="dialog">
    <div class="modal-content">
      <form>
        <div class="modal-body text-center">
          <div class="pb-3">
            <i class="fas fa-question-circle fa-3x d-block m-auto text-gray"
            ></i>
          </div>
          Bu sunucuyu kaldırmak istediğinizden emin misiniz?

          <input
            class="form-control my-3"
            placeholder="Hesap Şifresi"
            type="password" />
        </div>

        <div class="modal-footer flex-nowrap">
          <button class="btn btn-link col-6 m-0" type="button"> İptal </button>
          <button class="btn btn-danger col-6 m-0" type="button">Evet</button>
        </div>
      </form>
    </div>
  </div>
</div>

<script context="module">
  import { writable } from "svelte/store";

  const dialogID = "confirmRemoveServer";

  let callback = () => {};
  let hideCallback = () => {};
  let modal;

  const server = writable({});
  const loading = writable(false);

  export function show(newServer) {
    modal = new window.bootstrap.Modal(document.getElementById(dialogID), {
      backdrop: "static",
      keyboard: false,
    });

    loading.set(false);
    server.set(newServer);

    modal.show();
  }

  export function hide() {
    hideCallback();

    modal.hide();
  }

  export function setCallback(newCallback) {
    callback = newCallback;
  }

  export function onHide(newCallback) {
    hideCallback = newCallback;
  }
</script>
