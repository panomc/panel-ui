<script>
  import Icon from "svelte-awesome";
  import {
    faQuestionCircle,
    faExclamationCircle
  } from "@fortawesome/free-solid-svg-icons";
</script>

<!-- Confirm Delete Ticket Category Modal -->
<div
  aria-hidden="true"
  class="modal fade"
  id="confirmDeleteTicketCategory"
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
        Bu kategoriyi kalıcı olarak silmek istediğinizden emin misiniz?
        <br />
        <br />
        <span class="text-danger">
          <Icon data="{faExclamationCircle}" class="mr-1" />
          İçerisindeki 12 yazı kategorisiz kalacak:
        </span>
        <br />
        <ul class="list-unstyled">
          <li>Yazı 1</li>
          <li>Yazı 2</li>
          <li>Yazı 3</li>
          <li>Yazı 4</li>
        </ul>
        <a href="#">Daha Fazlasını Göster</a>
      </div>
      <div class="modal-footer">
        <button
          class="btn btn-link text-muted"
          data-dismiss="modal"
          type="button"
        >
          İptal
        </button>
        <button class="btn btn-danger" type="button">Evet</button>
      </div>
    </div>
  </div>
</div>
