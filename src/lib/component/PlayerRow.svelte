<tr class:table-primary="{player.selected}">
  <th scope="row">
    <div class="dropdown position-static">
      <button
        type="button"
        class="btn btn-link btn-sm"
        aria-expanded="false"
        aria-haspopup="true"
        data-bs-toggle="dropdown"
        href="javascript:void(0);"
        title="Eylemler">
        <span class="fas fa-ellipsis-v"></span>
      </button>
      <div
        class="dropdown-menu dropdown-menu-start animate__animated animate__fadeIn">
        <a
          class="dropdown-item"
          href="javascript:void(0);"
          on:click="{showAuthorizePlayerModal}">
          <i class="fas fa-user-circle me-2"></i>
          Yetkilendir
        </a>
        <a
          class="dropdown-item"
          href="javascript:void(0);"
          on:click="{showEditPlayerModal}">
          <i class="fa-solid fa-pencil-alt me-2"></i>
          Düzenle
        </a>
        {#if player.isBanned}
          <a
            class="dropdown-item link-danger"
            href="javascript:void(0);"
            on:click="{showUnbanPlayerModal}">
            <i class="fas fa-gavel me-2"></i>
            Yasağı Kaldır
          </a>
        {:else}
          <a
            class="dropdown-item link-danger"
            href="javascript:void(0);"
            on:click="{showBanPlayerModal}">
            <i class="fas fa-gavel me-2"></i>
            Yasakla
          </a>
        {/if}
        <a
          class="dropdown-item link-danger"
          href="javascript:void(0);"
          on:click="{showBanPlayerModal}">
          <i class="fas fa-trash me-2"></i>
          Sil
        </a>
      </div>
    </div>
  </th>
  <td class="min-w-200px align-middle text-nowrap">
    <a title="Görüntüle" href="{base}/players/player/{player.username}">
      <img
        alt="{player.username}"
        class="rounded-circle mr-3 animate__animated animate__zoomIn me-2"
        height="32"
        src="https://crafthead.net/avatar/{player.username}"
        width="32" />
      {player.username}
    </a>
  </td>
  <td class="align-middle text-nowrap text-capitalize">
    <a
      title="Filtrele"
      href="{base}/players/by-perm-group/{player.permissionGroup}">
      {player.permissionGroup === "-" ? "Oyuncu" : player.permissionGroup}
    </a>
  </td>
  <td class="align-middle text-nowrap">
    {#if player.isBanned}
      <div class="badge bg-danger text-white">Yasaklı</div>
    {:else if isOnline}
      <div
        class="badge bg-secondary rounded-pill text-white"
        use:tooltip="{[(player.inGame ? 'Oyunda' : 'Sitede') + ' Çevrimiçi', { placement: 'bottom' }]}">
        <span>Çevrimiçi</span>
      </div>
    {:else}
      <div
        class="badge bg-secondary rounded-pill text-white"
        use:tooltip="{[getOfflineRelativeDateText(checkTime), { placement: 'bottom' }]}">
        <span>Çevrimdışı</span>
      </div>
    {/if}
  </td>
  <td class="align-middle text-nowrap"
    ><DateComponent time="{player.lastLoginDate}" /></td>
  <td class="align-middle text-nowrap">
    <DateComponent time="{player.registerDate}" />
  </td>
</tr>

<script>
  import { base } from "$app/paths";

  import DateComponent from "$lib/component/Date.svelte";

  import tooltip from "$lib/tooltip.util";
  import { createEventDispatcher } from "svelte";
  import { formatRelative } from "date-fns";

  export let player;
  export let checkTime;

  $: isOnline =
    player.lastActivityTime > Date.now() - 5 * 60 * 1000 || player.inGame;

  const dispatch = createEventDispatcher();

  function showAuthorizePlayerModal() {
    dispatch("showAuthorizePlayerModalClick", { player });
  }

  function showEditPlayerModal() {
    dispatch("showEditPlayerModalClick", { player });
  }

  function showBanPlayerModal() {
    dispatch("showBanPlayerModalClick", { player });
  }

  function showUnbanPlayerModal() {
    dispatch("showUnbanPlayerModalClick", { player });
  }

  function getOfflineRelativeDateText(checkTime) {
    return formatRelative(
      new Date(parseInt(player.lastActivityTime)),
      new Date()
    ).capitalize()
  }

  String.prototype.capitalize = function () {
    return this.charAt(0).toUpperCase() + this.slice(1);
  };
</script>
