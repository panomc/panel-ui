<!-- SetPostThumbnailModal Modal -->
<div
  id="setPostThumbnailModal"
  aria-hidden="true"
  class="modal fade"
  role="dialog"
  tabindex="-1"
>
  <div class="modal-dialog modal-dialog-centered" role="dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title">Küçük Resim Belirle</h5>
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
      <form>
        <div class="modal-body">
          <div class="form-group">
            <div class="container text-center">
              <i class="fas fa-image fa-3x mr-3 text-glass"></i>
              <p class="text-gray">Küçük resim belirlenmedi.</p>
            </div>
          </div>

          <!--           <div class="form-group">
            <img src="../../assets/img/vanilla.png" class="border rounded img-fluid" title="Küçük Resim" alt="Küçük Resim">
          </div> -->

          <div class="form-group text-center">
            <button href="#" class="btn btn-link text-danger mr-2">
              <i class="fas fa-trash"></i>
            </button>
            <input
              type="file"
              id="postThumbnail"
              name="postThumbnail"
              class="btn bg-lightprimary text-primary"
            />
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-block btn-primary" type="submit">
            Kaydet
          </button>
        </div>
      </form>
    </div>
  </div>
</div>
