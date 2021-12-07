<tr>
  <th class="min-w-50px" scope="row">
    <div class="dropdown position-absolute">
      <a
        class="btn btn-sm py-0"
        aria-expanded="false"
        aria-haspopup="true"
        data-toggle="dropdown"
        href="javascript:void(0);"
        id="playerAction"
        title="Eylemler">
        <i class="fas fa-ellipsis-v"></i>
      </a>
      <div
        aria-labelledby="playerAction"
        class="dropdown-menu animate__animated animate__zoomIn">
        <a
          class="dropdown-item"
          href="javascript:void(0);"
          on:click="{showAuthorizePlayerModal}">
          <i class="fas fa-user-circle mr-1 text-primary"></i>
          Yetkilendir
        </a>
        <a
          class="dropdown-item"
          href="javascript:void(0);"
          on:click="{showEditPlayerModal}">
          <i class="fas fa-pencil-alt mr-1 text-primary"></i>
          Düzenle
        </a>
        <a
          class="dropdown-item"
          data-target="#conformBanTickets"
          data-toggle="modal"
          href="javascript:void(0);">
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
    <i
      aria-hidden="true"
      class="fa fa-times text-danger fa-fw"
      use:tooltip="{['Talepleri Yasaklı', { placement: 'top' }]}"></i>
  </td>
  <td class="align-middle text-nowrap">
    <span
      class="badge badge-pill badge-lightsecondary text-success"
      use:tooltip="{['Sitede', { placement: 'top' }]}">
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
