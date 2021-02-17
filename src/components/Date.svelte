<script>
  import moment from "moment";

  import tooltip from "../pano/js/tooltip.util";

  export let time;

  $: date = time;
</script>

<span
  use:tooltip="{['bottom', moment(parseInt(date)).format('DD/MM/YYYY, HH:mm')]}"
  >{moment(parseInt(date)).calendar()}</span>
