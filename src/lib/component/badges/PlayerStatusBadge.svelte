{#if banned}
  <div class="badge bg-danger text-white">Yasaklı</div>
{:else if isOnline}
  <div
    class="badge bg-secondary rounded-pill text-white"
    use:tooltip="{[(inGame ? 'Oyunda' : 'Sitede') + ' Çevrimiçi', { placement: 'bottom' }]}">
    <span>Çevrimiçi</span>
  </div>
{:else}
  <div
    class="badge bg-secondary rounded-pill text-white"
    use:tooltip="{[getOfflineRelativeDateText(checkTime), { placement: 'bottom' }]}">
    <span>Çevrimdışı</span>
  </div>
{/if}

<script context="module">
  String.prototype.capitalize = function () {
    return this.charAt(0).toUpperCase() + this.slice(1);
  };
</script>

<script>
  import { formatRelative } from "date-fns";

  import tooltip from "$lib/tooltip.util";

  export let banned = false;
  export let lastActivityTime = 0;
  export let inGame = 0;
  export let checkTime = 0;

  $: isOnline = lastActivityTime > Date.now() - 5 * 60 * 1000 || inGame;

  function getOfflineRelativeDateText(checkTime) {
    return formatRelative(
      new Date(parseInt(lastActivityTime)),
      new Date()
    ).capitalize()
  }
</script>