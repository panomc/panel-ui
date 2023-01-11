<a
  title="Filtrele"
  href="{base}/players/by-perm-group/{permissionGroup}"
  class:badge="{permissionGroup !== '-'}"
  class:bg-light="{permissionGroup !== '-'}"
  class:text-dark="{permissionGroup !== '-'}"
  class:rounded-pill="{permissionGroup !== '-'}">
  {permissionGroup === "-" ? "Oyuncu" : permissionGroup.capitalize()}
</a>

<script context="module">
  String.prototype.capitalize = function () {
    return this.charAt(0).toUpperCase() + this.slice(1);
  };
</script>

<script>
  import { base } from "$app/paths";

  export let permissionGroup;

  String.prototype.capitalize = function () {
    return this.charAt(0).toUpperCase() + this.slice(1);
  };
</script>
