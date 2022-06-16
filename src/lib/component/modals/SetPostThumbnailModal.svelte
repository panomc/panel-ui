<!-- SetPostThumbnailModal Modal -->
<div
  id="setPostThumbnailModal"
  aria-hidden="true"
  class="modal fade"
  role="dialog"
  tabindex="-1">
  <div class="modal-dialog modal-dialog-centered" role="dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title">Küçük Resim Belirle</h5>
        <button
          aria-label="Kapat"
          class="btn-close"
          data-bs-dismiss="modal"
          title="Pencereyi Kapat"
          type="button">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <form>
        <div class="modal-body">
          <div class="container text-center animate__animated animate__zoomIn">
            <i class="fas fa-image fa-3x text-dark text-opacity-25 m-3"></i>
            <p class="text-gray">Küçük resim belirlenmedi.</p>
          </div>

          <div class="input-group">
            <input type="file" class="form-control" id="inputGroupFile02" />
            <label class="input-group-text" for="inputGroupFile02"
              >Upload</label>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn w-100 btn-primary" type="submit">Kaydet</button>
        </div>
      </form>
    </div>
  </div>
</div>
