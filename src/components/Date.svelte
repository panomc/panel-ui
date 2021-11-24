<!--  .format('DD/MM/YYYY, HH:mm')-->
<span
  use:tooltip="{[
    format(new Date(parseInt(date)), 'dd/MM/yyyy, HH:mm'),
    { placement: 'bottom' },
  ]}">{format(new Date(parseInt(date)), "dd/MM/yyyy")}</span
>

<script>
  import { format } from "date-fns";

  import tooltip from "$lib/tooltip.util";

  export let time;

  $: date = time;
</script>
