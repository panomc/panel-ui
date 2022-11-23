<div
  id="appToast{id}"
  class="animate__animated animate__bounceInUp toast align-items-center text-bg-light border-0 bg-sunflower"
  role="alert"
  aria-live="assertive"
  aria-atomic="true">
  <div class="d-flex">
    <div class="toast-body"><slot /></div>
    <button
      type="button"
      class="btn-close btn-close-white me-2 m-auto"
      data-bs-dismiss="toast"></button>
  </div>
</div>

<script>
  export let id;
</script>
