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
      <a
        href="javascript:void(0);"
        class="btn btn-secondary"
        on:click="{() => onCreatePermissionGroupClick()}">
        <i class="fas fa-plus me-2"></i>
        Yetki Grubu Oluştur
      </a>
    </div>
  </div>

  <div class="card">
    <div class="card-body table-responsive">
      <table class="table table-borderless" style="width: auto !important;">
        <thead>
          <tr class="align-top">

            <!-- Blank Cell -->
            <th scope="col" ></th>

            <!-- Perm Group Name & User Pictures Cell -->
            {#each data.permissionGroups as permissionGroup, index (permissionGroup)}
              <th
                scope="col"
                class="text-center">
                <a
                  class="text-capitalize"
                  href="javascript:(void);"
                  on:click="{() =>
                    onShowEditPermissionGroupButtonClick(permissionGroup)}"
                  Z>
                  {permissionGroup.name}
                </a>
                <div
                  class="d-flex flex-row flex-row-reverse justify-content-center align-items-center">
                  {#if permissionGroup.userCount > 3}
                    <small>
                      +{permissionGroup.userCount - 3}
                    </small>
                  {/if}
                  {#each permissionGroup.users as user, index (user)}
                    <span
                      class="overlapping-avatar"
                      use:tooltip="{[user, { placement: 'bottom' }]}">
                      <a href="{base}/players/player/{user}">
                        <img
                          class="animate__animated animate__zoomIn"
                          src="https://minotar.net/avatar/{user}"
                          width="28"
                          height="28"
                          alt="{user}" />
                      </a>
                    </span>
                  {/each}
                </div>
              </th>
            {/each}
          </tr>
        </thead>
        <tbody>
          {#each data.permissions as permission, index (permission)}
            <tr>
              <th
                scope="col"
                use:tooltip="{[
                  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis vehicula, enim in fermentum accumsan,',
                  { placement: 'right' },
                ]}">
                <!--              TODO: Icon system-->
                <!--              <Icon-->
                <!--                data="{icon[convertIconName(permission.iconName)]}"-->
                <!--                class="text-primary d-block m-auto" />-->
                <small class="mb-0">
                  {permission.name}
                </small>
              </th>

              <!-- Checkboxes Section -->
              {#each data.permissionGroups as permissionGroup, index (permissionGroup)}
                <td class="align-middle">
                  <div
                    class="form-check form-switch d-flex justify-content-center align-content-center">
                    <input
                      type="checkbox"
                      class="form-check-input"
                      id="{permission.name}_{permissionGroup.name}"
                      checked="{isPermissionChecked(
                        permissionGroup,
                        permission
                      )}"
                      on:click="{() =>
                        onPermissionClick(permissionGroup, permission)}"
                      disabled="{isPermissionDisabled(
                        permission,
                        permissionGroup,
                        loadingPermissionsList
                      )}" />
                  </div>
                </td>
              {/each}
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  </div>
</div>

<AddEditPermGroupModal />
<ConfirmDeletePermissionGroupModal />

<script context="module">
  import ApiUtil from "$lib/api.util.js";
  import { showNetworkErrorOnCatch } from "$lib/store.js";

  async function loadData({ request, CSRFToken }) {
    return new Promise((resolve, reject) => {
      ApiUtil.get({
        path: "/api/panel/initPage/permissionsPage",
        request,
        CSRFToken,
      }).then((body) => {
        if (body.result === "ok") {
          resolve(body);
        } else {
          reject(body);
        }
      });
    });
  }

  /**
   * @type {import('@sveltejs/kit').Load}
   */
  export async function load(request) {
    let output = {
      props: {
        data: {
          permissions: [],
          permissionGroups: [],
          permissionGroupPerms: {},
        },
      },
    };

    if (request.stuff.NETWORK_ERROR) {
      output.props.data.NETWORK_ERROR = true;

      return output;
    }

    await loadData({ request }).then((data) => {
      output.props.data = { ...output.props.data, ...data };
    });

    return output;
  }
</script>

<script>
  import { base } from "$app/paths";
  import { session } from "$app/stores";

  import tooltip from "$lib/tooltip.util.js";
  import { pageTitle } from "$lib/store.js";

  import AddEditPermGroupModal, {
    show as showPermissionGroupAddEditModal,
    setCallback as setCallbackForPermissionGroupAddEditModal,
  } from "$lib/component/modals/AddEditPermGroupModal.svelte";

  import ConfirmDeletePermissionGroupModal, {
    setCallback as setDeletePermissionGroupModalCallback,
    show as showDeletePermissionGroupModal,
  } from "$lib/component/modals/ConfirmDeletePermissionGroupModal.svelte";

  export let data;

  pageTitle.set("Yetkiler");

  if (data.NETWORK_ERROR) {
    showNetworkErrorOnCatch((resolve, reject) => {
      loadData({ CSRFToken: $session.CSRFToken })
        .then((body) => {
          data = { ...data, ...body };

          resolve();
        })
        .catch(() => {
          reject();
        });
    }, true);
  }

  let loadingPermissionsList = [];

  function reloadData() {
    showNetworkErrorOnCatch((resolve, reject) => {
      loadData({ CSRFToken: $session.CSRFToken })
        .then((loadedData) => {
          resolve();

          data = loadedData;
        })
        .catch(() => {
          reject();
        });
    });
  }

  String.prototype.capitalize = function () {
    return this.charAt(0).toUpperCase() + this.slice(1);
  };

  function refreshBrowserPage() {
    location.reload();
  }

  function convertIconName(iconName) {
    const iconNameSplit = iconName.split("-");
    let restOfIconName = "";

    iconNameSplit
      .filter((iconName, index) => index !== 0)
      .forEach((iconName) => {
        restOfIconName += iconName.capitalize();
      });

    return iconNameSplit[0] + restOfIconName;
  }

  function isPermissionChecked(permissionGroup, permission) {
    return (
      permissionGroup.name === "admin" ||
      (typeof data.permissionGroupPerms[permissionGroup.id] === "undefined"
        ? false
        : !!data.permissionGroupPerms[permissionGroup.id].includes(
            permission.id
          ))
    );
  }

  function isPermissionDisabled(
    permission,
    permissionGroup,
    loadingPermissionsList
  ) {
    return (
      permissionGroup.name === "admin" ||
      loadingPermissionsList[permission.name + "_" + permissionGroup.name]
    );
  }

  function onPermissionClick(permissionGroup, permission) {
    loadingPermissionsList[permission.name + "_" + permissionGroup.name] = true;
    const mode = isPermissionChecked(permissionGroup, permission)
      ? "DELETE"
      : "ADD";

    showNetworkErrorOnCatch((resolve, reject) => {
      ApiUtil.put({
        path: `/api/panel/permissionGroups/${permissionGroup.id}/permissions/${permission.id}`,
        body: {
          mode: mode,
        },
        CSRFToken: $session.CSRFToken,
      })
        .then((body) => {
          if (body.result === "ok") {
            loadingPermissionsList[
              permission.name + "_" + permissionGroup.name
            ] = false;

            if (mode === "ADD") {
              if (
                typeof data.permissionGroupPerms[permissionGroup.id] ===
                "undefined"
              )
                data.permissionGroupPerms[permissionGroup.id] = [
                  permission.id,
                ];
              else
                data.permissionGroupPerms[permissionGroup.id].push(
                  permission.id
                );
            } else {
              data.permissionGroupPerms[permissionGroup.id].splice(
                data.permissionGroupPerms[permissionGroup.id].indexOf(
                  permission.id
                ),
                1
              );
            }

            resolve();
          } else if (body.error === "NOT_EXISTS") refreshBrowserPage();
          else reject();
        })
        .catch(() => {
          reject();
        });
    });
  }

  function onCreatePermissionGroupClick() {
    showPermissionGroupAddEditModal("create");
  }

  function onShowEditPermissionGroupButtonClick(permissionGroup) {
    showPermissionGroupAddEditModal("edit", permissionGroup);
  }

  function onShowDeletePermissionGroupModalClick(permissionGroup) {
    showDeletePermissionGroupModal(permissionGroup);
  }

  setCallbackForPermissionGroupAddEditModal(() => {
    reloadData();
  });

  setDeletePermissionGroupModalCallback((permissionGroup) => {
    data.permissionGroups.forEach((permGroup, index) => {
      if (permGroup.id === permissionGroup.id) {
        data.permissionGroups.splice(index, 1);
      }
    });

    data.permissionGroups = data.permissionGroups;

    Object.keys(data.permissionGroupPerms).forEach(
      (permissionGroupPermsId, index) => {
        if (permissionGroupPermsId === permissionGroup.id) {
          data.permissionGroups.splice(index, 1);
        }
      }
    );

    data.permissionGroupPerms = data.permissionGroupPerms;
  });
</script>
