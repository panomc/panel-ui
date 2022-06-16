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
        <span class="fas fa-ellipsis-h"></span>
      </button>
      <div
        class="dropdown-menu dropdown-menu-start animate__animated animate__fadeIn">
        <a
          class="dropdown-item"
          href="javascript:void(0);"
          on:click="{showAuthorizePlayerModal}">
          <i class="fas fa-user-circle"></i>
          Yetkilendir
        </a>
        <a
          class="dropdown-item"
          href="javascript:void(0);"
          on:click="{showEditPlayerModal}">
          <i class="fa-solid fa-pencil-alt"></i>
          Düzenle
        </a>
        <a
          class="dropdown-item link-danger"
          data-target="#conformBanTickets"
          data-toggle="modal"
          href="javascript:void(0);">
          <i class="fas fa-gavel"></i>
          Yasakla
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
        src="https://minotar.net/avatar/{player.username}"
        width="32" />
      {player.username}
    </a>
  </td>
  <td class="align-middle text-nowrap text-capitalize">
    <a
      title="Filtrele"
      class="badge bg-light text-black rounded-pill"
      href="{base}/players/permission/{player.permissionGroup}">
      {player.permissionGroup === "-" ? "Oyuncu" : player.permissionGroup}
    </a>
  </td>
  <td class="align-middle text-nowrap">
    <div
      class="badge bg-secondary rounded-pill text-white"
      use:tooltip="{['Sitede', { placement: 'bottom' }]}">
      <span>Çevrimiçi</span>
    </div>
  </td>
  <td class="align-middle text-nowrap">10 dakika önce</td>
  <td class="align-middle text-nowrap">
    <Date time="{player.registerDate}" />
  </td>
</tr>

<script>
  import { base } from "$app/paths";

  import Date from "$lib/component/Date.svelte";

  import tooltip from "$lib/tooltip.util";
  import { createEventDispatcher } from "svelte";

  export let player;

  const dispatch = createEventDispatcher();

  function showAuthorizePlayerModal() {
    dispatch("showAuthorizePlayerModalClick", { player });
  }

  function showEditPlayerModal() {
    dispatch("showEditPlayerModalClick", { player });
  }
</script>
