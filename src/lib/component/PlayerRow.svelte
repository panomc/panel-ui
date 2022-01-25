<tr class:table-primary="{player.selected}">
  <th scope="row">
    <div class="dropdown position-static">
      <button
        type="button"
        class="btn btn-link btn-sm"
        aria-expanded="false"
        aria-haspopup="true"
        data-bs-toggle="dropdown"
        href="#"
        title="Eylemler">
        <span class="fas fa-ellipsis-h"></span>
      </button>
      <div class="dropdown-menu dropdown-menu-start animate__animated animate__fadeIn">
        <a class="dropdown-item" href="#" on:click="{showAuthorizePlayerModal}">
          <i class="fas fa-user-circle mr-1 text-primary"></i>
          Yetkilendir
        </a>
        <a class="dropdown-item" href="#" on:click="{showEditPlayerModal}">
          <i class="fas fa-pencil-alt mr-1 text-primary"></i>
          Düzenle
        </a>
        <a
          class="dropdown-item"
          data-target="#conformBanTickets"
          data-toggle="modal"
          href="#">
          <i class="fas fa-gavel mr-1 text-danger"></i>
          Yasakla
        </a>
      </div>
    </div>
  </th>
  <td class="min-w-200px align-middle text-nowrap">
    <a
      title="Oyuncu Profiline Git"
      href="{base}/players/player/{player.username}">
      <img
        alt="{player.username}"
        class="rounded-circle border mr-3 animate__animated animate__zoomIn"
        height="32"
        src="https://minotar.net/avatar/{player.username}"
        width="32" />
      {player.username}
    </a>
  </td>
  <td class="align-middle text-nowrap text-capitalize">
    <a href="{base}/players/permission/{player.permission_group}">
      {player.permission_group === "-" ? "Oyuncu" : player.permission_group}
    </a>
  </td>
  <td class="align-middle text-nowrap">
    <span
      class="badge rounded-pill bg-secondary"
      use:tooltip="{['Sitede', { placement: 'bottom' }]}">
      <i aria-hidden="true" class="fa fa-globe fa-fw"></i>
      <span class="d-md-inline d-none ml-1">Çevrimiçi</span>
    </span>
  </td>
  <td class="align-middle text-nowrap">10 dakika önce</td>
  <td class="align-middle text-nowrap">
    <Date time="{player.register_date}" />
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
