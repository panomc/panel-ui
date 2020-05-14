<!-- Add / Edit Ticket Category Modal -->
<div
  aria-hidden="true"
  class="modal fade"
  id="addEditTicketCategory"
  role="dialog"
  tabindex="-1"
>
  <div class="modal-dialog modal-dialog-centered" role="dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title">Kategori Ekle</h5>

        <button
          aria-label="Kapat"
          class="close"
          data-dismiss="modal"
          title="Pencereyi Kapat"
          type="button"
        >
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <!--        @submit.prevent="submitSaveOrAdd"-->
      <form>
        <div class="modal-body">
          <div class="form-group">
            <label for="category">Kategori:</label>
            <!--              :class="{ 'border-danger': categoryForm.error.name }"-->
            <!--              v-model="categoryForm.name"-->
            <input class="form-control" id="category" type="text" />
          </div>
          <div class="form-group">
            <label for="categoryDescription">Açıklama:</label>
            <!--              :class="{ 'border-danger': categoryForm.error.description }"-->
            <!--              v-model="categoryForm.description"-->
            <input class="form-control" id="categoryDescription" type="text" />
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-block btn-secondary" type="submit">
            Kaydet
          </button>
        </div>
      </form>
    </div>
  </div>
</div>
