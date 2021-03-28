<!--suppress SillyAssignmentJS -->
<script>
  import Icon from "svelte-awesome";
  import * as icon from "@fortawesome/free-solid-svg-icons";

  import { isPageInitialized, showNetworkErrorOnCatch } from "../../Store";
  import tooltip from "../../pano/js/tooltip.util";
  import ApiUtil from "../../pano/js/api.util";

  import AddEditPermGroupModal, {
    show as showPermissionGroupAddEditModal,
    setCallback as setCallbackForPermissionGroupAddEditModal,
  } from "../../components/modals/AddEditPermGroupModal.svelte";

  import ConfirmDeletePermissionGroupModal, {
    setCallback as setDeletePermissionGroupModalCallback,
    show as showDeletePermissionGroupModal,
  } from "../../components/modals/ConfirmDeletePermissionGroupModal.svelte";

  let permissions = [];
  let permissionGroups = [];
  let permissionGroupPerms = {};
  let loadingPermissionsList = [];

  function getData() {
    showNetworkErrorOnCatch((resolve, reject) => {
      ApiUtil.get("panel/initPage/permissionsPage")
        .then((response) => {
          if (response.data.result === "ok") {
            permissions = response.data.permissions;
            permissionGroups = response.data.permission_groups;
            permissionGroupPerms = response.data.permission_group_perms;

            isPageInitialized.set(true);

            resolve();
          } else reject();
        })
        .catch(() => {
          reject();
        });
    });
  }

  String.prototype.capitalize = function () {
    return this.charAt(0).toUpperCase() + this.slice(1);
  };

  getData();

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
      (typeof permissionGroupPerms[permissionGroup.id] === "undefined"
        ? false
        : !!permissionGroupPerms[permissionGroup.id].includes(permission.id))
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
      ApiUtil.post("panel/permission/set", {
        mode: mode,
        permission_group_id: permissionGroup.id,
        permission_id: permission.id,
      })
        .then((response) => {
          if (response.data.result === "ok") {
            loadingPermissionsList[
              permission.name + "_" + permissionGroup.name
            ] = false;

            if (mode === "ADD") {
              if (
                typeof permissionGroupPerms[permissionGroup.id] === "undefined"
              )
                permissionGroupPerms[permissionGroup.id] = [permission.id];
              else permissionGroupPerms[permissionGroup.id].push(permission.id);
            } else {
              permissionGroupPerms[permissionGroup.id].splice(
                permissionGroupPerms[permissionGroup.id].indexOf(permission.id),
                1
              );
            }

            resolve();
          } else if (response.data.error === "NOT_EXISTS") refreshBrowserPage();
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
    getData();
  });

  setDeletePermissionGroupModalCallback((permissionGroup) => {
    permissionGroups.splice(permissionGroups.indexOf(permissionGroup), 1);
    permissionGroups = permissionGroups;

    if (typeof permissionGroupPerms[permissionGroup.id] !== "undefined")
      permissionGroupPerms.splice(
        permissionGroupPerms.indexOf(permissionGroup.id),
        1
      );
  });
</script>

<div class="container">
  <!-- Action Menu -->
  <div class="row justify-content-between align-items-center mb-3">
    <div class="col-6">
      <a class="btn btn-link" role="button" href="/panel/players">
        <Icon data="{icon['faArrowLeft']}" class="mr-1" />
        Oyuncular
      </a>
    </div>
    <div class="col-6 text-right">
      <a
        href="javascript:void(0);"
        class="btn btn-primary"
        on:click="{() => onCreatePermissionGroupClick()}">
        <Icon data="{icon['faPlus']}" class="mr-1" />
        Yetki Grubu Oluştur
      </a>
    </div>
  </div>

  <h3 class="text-muted badge badge-lightprimary panel-subtitle">
    Yetki Grupları
  </h3>

  <div class="card">
    <div class="card-body table-responsive">
      <table class="table table-borderless">
        <thead>
          <tr class="text-center text-muted align-top">
            <th scope="col"></th>
            <th
              scope="col"
              use:tooltip="{[
                'top',
                'Panele erişebilir, ayarları ve panel içeriklerini görüntüleyebilir',
              ]}">
              <Icon
                data="{icon.faSignInAlt}"
                class="text-primary d-block m-auto" />
              <small class="mb-0 font-weight-bolder">Panel Erişimi</small>
            </th>
            {#each permissions as permission, index (permission)}
              <th
                scope="col"
                use:tooltip="{[
                  'top',
                  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis vehicula, enim in fermentum accumsan,',
                ]}">
                <Icon
                  data="{icon[convertIconName(permission.iconName)]}"
                  class="text-primary d-block m-auto" />
                <small class="mb-0 font-weight-bolder">
                  {permission.name}
                </small>
              </th>
            {/each}
            <!--            <th-->
            <!--              scope="col"-->
            <!--              use:tooltip="{[-->
            <!--                'top',-->
            <!--                'Platforma sunucu bağlayabilir ve bağlı sunucuları yönetebilir',-->
            <!--              ]}">-->
            <!--              <Icon data="{icon.faCubes}" class="text-primary d-block m-auto" />-->
            <!--              <h6 class="mb-0 mt-2">Sunucuları Yönet</h6></th>-->
            <!--            <th-->
            <!--              scope="col"-->
            <!--              use:tooltip="{[-->
            <!--                'top',-->
            <!--                'Websiteye yazılar ekleyebilir ve yazıları düzenleyebilir',-->
            <!--              ]}">-->
            <!--              <Icon-->
            <!--                data="{icon.faStickyNote}"-->
            <!--                class="text-primary d-block m-auto" />-->
            <!--              <h6 class="mb-0 mt-2">Yazıları Yönet</h6></th>-->
            <!--            <th-->
            <!--              scope="col"-->
            <!--              use:tooltip="{['top', 'Oyuncu taleplerini yönetebilir']}">-->
            <!--              <Icon-->
            <!--                data="{icon.faTicketAlt}"-->
            <!--                class="text-primary d-block m-auto" />-->
            <!--              <h6 class="mb-0 mt-2">Talepleri Yönet</h6></th>-->
            <!--            <th scope="col" use:tooltip="{['top', 'Oyuncuları yönetebilir']}">-->
            <!--              <Icon data="{icon.faUsers}" class="text-primary d-block m-auto" />-->
            <!--              <h6 class="mb-0 mt-2">Oyuncuları Yönet</h6></th>-->
            <!--            <th-->
            <!--              scope="col"-->
            <!--              use:tooltip="{[-->
            <!--                'top',-->
            <!--                'Websiteye tema ekleyebilir, temaları ve görünümünü düzenleyebilir',-->
            <!--              ]}">-->
            <!--              <Icon-->
            <!--                data="{icon.faPalette}"-->
            <!--                class="text-primary d-block m-auto" />-->
            <!--              <h6 class="mb-0 mt-2">Görünümü Yönet</h6></th>-->
            <!--            <th-->
            <!--              scope="col"-->
            <!--              use:tooltip="{[-->
            <!--                'top',-->
            <!--                'Eklenti ekleyebilir ve eklentileri yönetebilir',-->
            <!--              ]}">-->
            <!--              <Icon-->
            <!--                data="{icon.faPuzzlePiece}"-->
            <!--                class="text-primary d-block m-auto" />-->
            <!--              <h6 class="mb-0 mt-2">Eklentileri Yönet</h6></th>-->
            <!--            <th-->
            <!--              scope="col"-->
            <!--              use:tooltip="{['top', 'Platform ayarlarını yönetebilir']}">-->
            <!--              <Icon data="{icon.faCog}" class="text-primary d-block m-auto" />-->
            <!--              <h6 class="mb-0 mt-2">Platform Ayarlarını Yönet</h6></th>-->
          </tr>
        </thead>
        <tbody>
          {#each permissionGroups as permissionGroup, index (permissionGroup)}
            <tr>
              <th scope="row">
                <div class="d-flex flex-row align-items-center">
                  <div class="dropdown mr-3">
                    <a
                      class="btn btn-sm py-0"
                      aria-expanded="false"
                      aria-haspopup="true"
                      data-toggle="dropdown"
                      href="javascript:void(0);"
                      id="permAction"
                      title="Eylemler">
                      <Icon data="{icon.faEllipsisV}" />
                    </a>
                    <div
                      aria-labelledby="permAction"
                      class="dropdown-menu dropdown-menu-left">
                      <a
                        class="dropdown-item"
                        data-target="#addEditPermGroup"
                        data-toggle="modal"
                        href="javascript:void(0);"
                        on:click="{() =>
                          onShowEditPermissionGroupButtonClick(
                            permissionGroup
                          )}">
                        <Icon
                          data="{icon.faPencilAlt}"
                          class="text-primary mr-1" />
                        Düzenle
                      </a>
                      {#if permissionGroup.name !== "admin"}
                        <a
                          class="dropdown-item"
                          data-target="#confirmDeletePermGroup"
                          data-toggle="modal"
                          href="javascript:void(0);"
                          on:click="{() =>
                            onShowDeletePermissionGroupModalClick(
                              permissionGroup
                            )}">
                          <Icon
                            data="{icon.faTrash}"
                            class="text-danger mr-1" />
                          Sil
                        </a>
                      {/if}
                    </div>
                  </div>
                  <div>
                    <h5 class="text-capitalize">{permissionGroup.name}</h5>
                    <div
                      class="d-flex flex-row flex-row-reverse justify-content-end align-items-center mr-3">
                      {#if permissionGroup.user_count > 3}
                        <small class="pl-1"
                          >+{permissionGroup.user_count - 3}</small>
                      {/if}
                      {#each permissionGroup.users as user, index (user)}
                        <span class="overlapping-avatar" use:tooltip={['bottom', user]}>
                          <a href="/panel/players/player/{user}">
                            <img
                              src="https://minotar.net/avatar/{user}"
                              width="32"
                              height="32"
                              alt="{user}" />
                          </a>
                        </span>
                      {/each}
                    </div>
                  </div>
                </div>
              </th>
              <td class="align-middle text-center">
                <div class="custom-control custom-switch">
                  <input
                    type="checkbox"
                    class="custom-control-input active"
                    id="access_panel_{permissionGroup.name}"
                    checked="true"
                    disabled />
                  <label
                    class="custom-control-label"
                    for="access_panel_{permissionGroup.name}"></label>
                </div>
              </td>
              {#each permissions as permission, index (permission)}
                <td class="align-middle text-center">
                  <div class="custom-control custom-switch">
                    <input
                      type="checkbox"
                      class="custom-control-input"
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
                    <label
                      class="custom-control-label"
                      for="{permission.name}_{permissionGroup.name}"></label>
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
