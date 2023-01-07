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
        {#if hasPermission(Permissions.MANAGE_PERMISSION_GROUPS)}
          <a
            class="dropdown-item"
            href="javascript:void(0);"
            on:click="{showAuthorizePlayerModal}">
            <i class="fas fa-user-circle me-2"></i>
            Yetkilendir
          </a>
        {/if}
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
    <PlayerPermissionBadge permissionGroup="{player.permissionGroup}" />
  </td>
  <td class="align-middle text-nowrap">
    <PlayerStatusBadge
      banned="{player.isBanned}"
      lastActivityTime="{player.lastActivityTime}"
      inGame="{player.inGame}"
      checkTime="{checkTime}" />
  </td>
  <td class="align-middle text-nowrap"
    ><Date time="{player.lastLoginDate}" /></td>
  <td class="align-middle text-nowrap">
    <Date time="{player.registerDate}" />
  </td>
</tr>

<script>
  import { createEventDispatcher } from "svelte";

  import { base } from "$app/paths";

  import Date from "$lib/component/Date.svelte";
  import PlayerStatusBadge from "$lib/component/badges/PlayerStatusBadge.svelte";
  import PlayerPermissionBadge from "$lib/component/badges/PlayerPermissionBadge.svelte";
  import { hasPermission, Permissions } from "$lib/auth.util.js";

  export let player;
  export let checkTime;

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
</script>
