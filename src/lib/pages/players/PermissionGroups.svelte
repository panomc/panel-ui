<div class="container">
  <!-- Action Menu -->
  <div
    class="row justify-content-between align-items-center mb-3 animate__animated animate__slideInUp">
    <div class="col-auto">
      <a class="btn btn-link" role="button" href="{base}/players">
        <i class="fas fa-arrow-left me-2"></i>
        Oyuncular
      </a>
    </div>
    <div class="col-auto">
      <a href="{base}/players/perm-groups/create" class="btn btn-secondary">
        <i class="fas fa-plus me-2"></i>
        Yetki Grubu Oluştur
      </a>
    </div>
  </div>

  <div class="card">
    <div class="card-body">
      <!-- Permissions Table -->
      <h5 class="card-title mb-md-0">
        {data.permissionGroupCount} Yetki Grubu
      </h5>

      <div class="table-responsive">
        <table class="table table-borderless table-hover mb-0">
          <thead>
            <tr>
              <th class="align-middle text-nowrap" scope="col"></th>
              <th class="align-middle text-nowrap" scope="col">İsim</th>
              <th class="align-middle text-nowrap" scope="col">Yetki Adeti</th>
              <th class="align-middle text-nowrap" scope="col">Oyuncu Adeti</th>
            </tr>
          </thead>
          <tbody>
            {#each data.permissionGroups as permissionGroup, index (permissionGroup)}
              <tr class:table-primary="{permissionGroup.selected}">
                <th scope="row" class="align-middle">
                  {#if permissionGroup.name !== "admin"}
                    <a
                      class="btn btn-sm btn-link link-danger"
                      href="javascript:void(0);"
                      on:click="{() =>
                        onShowDeletePermissionGroupModalClick(permissionGroup)}"
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
                <td class="align-middle text-nowrap"
                  >{permissionGroup.userCount}</td>
              </tr>
            {/each}
          </tbody>
        </table>
        <!-- Pagination -->
        <Pagination
          page="{data.page}"
          totalPage="{data.totalPage}"
          on:firstPageClick="{() => reloadData(1)}"
          on:lastPageClick="{() => reloadData(data.totalPage)}"
          on:pageLinkClick="{(event) => reloadData(event.detail.page)}" />
        <!-- Pagination End -->
      </div>
    </div>
  </div>
</div>

<ConfirmDeletePermissionGroupModal />

<script context="module">
  import ApiUtil from "$lib/api.util.js";
  import { showNetworkErrorOnCatch } from "$lib/Store.js";
  import { error } from "@sveltejs/kit";

  async function loadData({ request, page }) {
    return new Promise((resolve, reject) => {
      ApiUtil.get({
        path: `/api/panel/permissionGroups?page=${page}`,
        request,
      }).then((body) => {
        if (body.result === "ok") {
          body.page = parseInt(page);

          resolve(body);
        } else {
          reject(body);
        }
      });
    });
  }

  /**
   * @type {import('@sveltejs/kit').PageLoad}
   */
  export async function load(event) {
    const { parent } = event;
    const parentData = await parent();

    let data = {
      permissions: [],
      permissionGroups: [],
      permissionGroupCount: 0,
      permissionGroupPerms: {},
      totalPage: 1,
      page: 1,
    };

    if (parentData.stuff.NETWORK_ERROR) {
      return data;
    }

    await loadData({ request: event, page: event.params.page || 1 })
      .then((body) => {
        data = { ...data, ...body };
      })
      .catch((body) => {
        if (body.error) {
          if (body.error === "PAGE_NOT_FOUND") {
            throw error(404, body.error);
          }

          throw error(500, body.error);
        }
      });

    return data;
  }
</script>

<script>
  import { base } from "$app/paths";
  import { goto } from "$app/navigation";

  import { pageTitle } from "$lib/Store.js";

  import ConfirmDeletePermissionGroupModal, {
    setCallback as setDeletePermissionGroupModalCallback,
    show as showDeletePermissionGroupModal,
    onHide as onDeletePermissionGroupModalHide
  } from "$lib/component/modals/ConfirmDeletePermissionGroupModal.svelte";

  import Pagination from "$lib/component/Pagination.svelte";

  export let data;

  pageTitle.set("Yetki Grupları");

  function reloadData(page = data.page) {
    showNetworkErrorOnCatch((resolve, reject) => {
      loadData({ page })
        .then((loadedData) => {
          resolve();

          if (page !== data.page) {
            goto(base + "/players/perm-groups/" + page);
          } else {
            data = loadedData;
          }
        })
        .catch((body) => {
          if (body.error === "PAGE_NOT_FOUND") {
            resolve();

            reloadData(page - 1);
          } else {
            reject();
          }
        });
    });
  }

  onDeletePermissionGroupModalHide((newPermissionGroup) => {
    data.permissionGroups.forEach((permissionGroup) => {
      if (permissionGroup.id === newPermissionGroup.id) {
        permissionGroup.selected = false;
      }
    });

    data.permissionGroups = data.permissionGroups;
  });

  function onShowDeletePermissionGroupModalClick(permissionGroup) {
    data.permissionGroups[data.permissionGroups.indexOf(permissionGroup)].selected = true;
    showDeletePermissionGroupModal(permissionGroup);
  }

  setDeletePermissionGroupModalCallback((newPermissionGroup) => {
    data.permissionGroups.forEach((permissionGroup) => {
      if (permissionGroup.id === newPermissionGroup.id) {
        permissionGroup.selected = false;
      }
    });

    data.permissionGroups = data.permissionGroups;

    reloadData();
  });
</script>
