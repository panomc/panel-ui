<!-- Confirm Remove Server Modal -->
<div
  aria-hidden="true"
  class="modal fade"
  id="{dialogID}"
  role="dialog"
  tabindex="-1">
  <div class="modal-dialog modal-dialog-centered" role="dialog">
    <div class="modal-content">
      <!--      @submit.prevent="submitRemoveServer"-->
      <form>
        <div class="modal-body text-center">
          <div class="pb-3">
            <i
              aria-hidden="true"
              class="fa fa-question-circle fa-4x d-block m-auto text-gray"></i>
          </div>
          Bu sunucuyu kaldırmak istediğinizden emin misiniz?
          <div class="container d-block m-auto">
            <label for="confirmRemoveServerPassword">
              Onaylamak için lütfen şifrenizi girin:
            </label>
            <!--            :class="{ 'border-danger': removingServerForm.error.password }"-->
            <input
              aria-describedby="helpId"
              class="form-control text-center mb-2"
              id="confirmRemoveServerPassword"
              placeholder="Pano Hesabı Şifreniz"
              type="password" />

            <small class="form-text text-danger d-inline">
              <i aria-hidden="true" class="fa fa-exclamation-circle fa-fw"></i>
              <!--              {{ removingServerForm.error.code }}-->
            </small>
          </div>
          <span class="text-danger">
            <i aria-hidden="true" class="fa fa-exclamation-circle fa-fw"></i>
            Platform ile eşitlenmiş sunucu verileri ve bilgileri sıfırlanacak.
          </span>
        </div>
        <div class="modal-footer">
          <button
            :disabled="removingServerForm.removing"
            class="btn btn-outline-primary w-100"
            data-dismiss="modal"
            type="button">
            İptal
          </button>

          <button
            :disabled="removingServerForm.removing ||
            removingServerForm.password === ''"
            class="btn btn-danger w-100"
            type="submit">
            <div
              class="spinner-border spinner-border-sm text-white"
              role="status">
            </div>
            <span>Evet</span>
          </button>
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

