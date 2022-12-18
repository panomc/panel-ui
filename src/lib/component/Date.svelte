<!--  .format('DD/MM/YYYY, HH:mm')-->

<span
  use:tooltip="{[
    format(new Date(parseInt(date)), 'dd/MM/yyyy, HH:mm'),
    { placement: 'bottom' },
  ]}">
  <slot>
    {#if relativeFormat}
      {formatRelative(new Date(parseInt(date)), new Date()).capitalize()}
    {:else}
      {format(new Date(parseInt(date)), "dd MMMM yyyy")}
    {/if}
  </slot>
</span>

<script>
  import { format, formatRelative } from "date-fns";

  import tooltip from "$lib/tooltip.util";

  String.prototype.capitalize = function () {
    return this.charAt(0).toUpperCase() + this.slice(1);
  };

  export let time;
  export let relativeFormat = true;

  $: date = time;
</script>
