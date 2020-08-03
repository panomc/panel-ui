<script>
  import Icon from "svelte-awesome";
  import { faQuestionCircle } from "@fortawesome/free-solid-svg-icons";
</script>

<!-- Move To Trash Post Confirmation Modal -->
<div
  aria-hidden="true"
  class="modal fade"
  id="moveToTrashPostConfirmationModal"
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
          <!--          v-text="post.status === 0 ? 'Bu yazıyı kalıcı olarak silmek istediğinizden emin misiniz?' : 'Bu yazıyı çöp kutusuna taşımak istediğinizden emin misiniz?'"-->
          <span></span>
      </div>
      <div class="modal-footer">
          <button
          class="btn btn-link text-muted"
          data-dismiss="modal"
          type="button"
          >
          İptal
          </button>
          <button
          class="btn btn-danger"
          type="button"
          >
          Evet
          </button>
      </div>
      </div>
  </div>
</div>