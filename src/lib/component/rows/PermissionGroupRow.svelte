<tr class:table-primary="{permissionGroup.selected}">
  <th scope="row" class="align-middle">
    {#if permissionGroup.name !== "admin"}
      <a
        class="btn btn-sm btn-link link-danger"
        href="javascript:void(0);"
        on:click="{onDeleteClick}"
        title="Sil">
        <i class="fas fa-trash"></i>
      </a>
    {/if}
  </th>
  <td class="align-middle text-nowrap">
    <a
      title="Düzenle"
      href="{base}/players/perm-groups/detail/{permissionGroup.id}"
      >{permissionGroup.name}</a>
  </td>
  <td class="align-middle text-nowrap"
    >{#if permissionGroup.name === "tayyib" || permissionGroup.name === "admin"}
      <i class="fas fa-infinity"></i>
    {:else}{permissionGroup.permissionCount}{/if}</td>
  <td class="align-middle text-nowrap">{permissionGroup.userCount}</td>
</tr>

<script>
  import { createEventDispatcher } from "svelte";

  import { base } from "$app/paths";

  export let permissionGroup;

  const dispatch = createEventDispatcher();

  function onDeleteClick() {
    dispatch("deleteClick", { permissionGroup });
  }
</script>
