<script>
  export let show;
</script>

<div
  class="align-items-center justify-content-center w-100 h-75 animated {show ? 'fadeIn' : 'fadeOut'}
  faster"
  hidden="{!show}"
  class:d-flex="{show}"
>
  <div class="spinner-border text-primary" role="status"></div>
</div>
