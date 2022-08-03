<!--  .format('DD/MM/YYYY, HH:mm')-->

<span
  use:tooltip="{[
    format(new Date(parseInt(date)), 'dd/MM/yyyy, HH:mm'),
    { placement: 'bottom' },
  ]}">
  <slot>
    {formatRelative(new Date(parseInt(date)), new Date()).capitalize()}
  </slot>
</span>

<script>
  import { format, formatRelative } from "date-fns";

  import tooltip from "$lib/tooltip.util";

  String.prototype.capitalize = function () {
    return this.charAt(0).toUpperCase() + this.slice(1);
  };

  export let time;

  $: date = time;
</script>
