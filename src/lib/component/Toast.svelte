<div
  id="appToast{id}"
  class="animate__animated animate__bounceInUp toast align-items-center text-bg-dark bg-dark"
  role="alert"
  aria-live="assertive"
  aria-atomic="true"
  data-bs-dismiss="toast">
  <div class="toast-body"><slot /></div>
</div>

<script>
  export let id;
</script>
