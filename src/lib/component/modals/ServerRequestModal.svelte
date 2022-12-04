<!-- Unban Player Modal -->
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
          <i class="fas fa-plug fa-3x d-block m-auto text-gray"></i>
        </div>
        X sunucusunu platforma bağlamak istediğinizden emin misiniz?
        <div class="card bg-light mb-3 text-start">
          <div class="row g-0">
            <div
              class="col-md-4 d-flex align-items-center justify-content-center">
              <img
                src="https://icons.iconarchive.com/icons/chrisl21/minecraft/64/Crafting-Table-icon.png"
                class="img-fluid"
                alt="SUNUCU ADI" />
            </div>
            <div class="col-md-8">
              <div class="card-body">
                <h6 class="card-title">SUNUCU IP</h6>
                <p class="card-text text-muted">32/140</p>
                <small class="badge bg-white text-black rounded-pill"
                  >Spigot</small>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="modal-footer flex-nowrap">
        <button
          class="btn btn-link col-6 m-0"
          type="button"
          class:disabled="{loading}"
          disabled="{loading}"
          on:click="{hide}">
          İptal
        </button>
        <button
          class="btn btn-secondary col-6 m-0"
          type="button"
          class:disabled="{loading}"
          disabled="{loading}"
          on:click="{onSubmit}">
          Bağla
        </button>
      </div>
    </div>
  </div>
</div>

<script context="module">
  const dialogID = "serverRequestModal";

  let callback = () => {};
  let hideCallback = () => {};
  let modal;

  export function show() {
    modal = new window.bootstrap.Modal(document.getElementById(dialogID), {
      backdrop: "static",
      keyboard: false,
    });

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

<script>
  let loading;

  function onSubmit() {}
</script>
