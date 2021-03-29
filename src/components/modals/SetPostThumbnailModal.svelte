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
          class="close"
          data-dismiss="modal"
          title="Pencereyi Kapat"
          type="button">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <form>
        <div class="modal-body">
          <div class="form-group">
            <div class="container text-center">
              <Icon data="{faImage}" scale="3" class="m-3 text-glass" />
              <p class="text-gray">Küçük resim belirlenmedi.</p>
            </div>
          </div>

          <!--           <div class="form-group">
            <img src="../../assets/img/vanilla.png" class="border rounded img-fluid" title="Küçük Resim" alt="Küçük Resim">
          </div> -->

          <div class="form-group text-center">
            <button href="#" class="btn btn-link text-danger mr-2">
              <Icon data="{faTrash}" />
            </button>
            <input
              type="file"
              id="postThumbnail"
              name="postThumbnail"
              class="btn bg-lightprimary text-primary" />
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

<script>
  import Icon from "svelte-awesome";
  import { faImage, faTrash } from "@fortawesome/free-solid-svg-icons";
</script>
