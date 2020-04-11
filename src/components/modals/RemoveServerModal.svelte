<!-- Confirm Remove Server Modal -->
<div
  aria-hidden="true"
  class="modal fade"
  id="confirmRemoveServer"
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
              class="fa fa-question-circle fa-4x d-block m-auto text-gray" />
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
              type="password"
              v-model="removingServerForm.password" />

            <small
              class="form-text text-danger d-inline"
              v-if="removingServerForm.error.code !== ''">
              <i aria-hidden="true" class="fa fa-exclamation-circle fa-fw" />
              <!--              {{ removingServerForm.error.code }}-->
            </small>
          </div>
          <span class="text-danger">
            <i aria-hidden="true" class="fa fa-exclamation-circle fa-fw" />
            Platform ile eşitlenmiş sunucu verileri ve bilgileri sıfırlanacak.
          </span>
        </div>
        <div class="modal-footer">
          <button
            :disabled="removingServerForm.removing"
            class="btn btn-outline-primary w-100"
            data-dismiss="modal"
            type="button">
            Hayır
          </button>

          <button
            :disabled="removingServerForm.removing ||
            removingServerForm.password === ''"
            class="btn btn-danger w-100"
            type="submit">
            <div
              class="spinner-border spinner-border-sm text-white"
              role="status"
              v-if="removingServerForm.removing" />
            <span v-if="!removingServerForm.removing">Evet</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</div>
