<div class="container">
  <!-- Action Menu -->
  <div class="row justify-content-between align-items-center mb-3">
    <div class="col-6">
      <a class="btn btn-link" role="button" href="{base}/players">
        <i class="fas fa-arrow-left mr-1"></i>
        Oyuncular
      </a>
    </div>
    <div class="col-6 text-right">
      <a
        href="javascript:void(0);"
        class="btn btn-primary"
        on:click="{() => onCreatePermissionGroupClick()}"
      >
        <i class="fas fa-plus mr-1"></i>
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
                'Panele erişebilir, ayarları ve panel içeriklerini görüntüleyebilir',
                { placement: 'top' },
              ]}"
            >
              <i class="fas fa-sign-in-alt text-primary d-block m-auto"></i>
              <small class="mb-0 font-weight-bolder">Panel Erişimi</small>
            </th>
            {#each data.permissions as permission, index (permission)}
              <th
                scope="col"
                use:tooltip="{[
                  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis vehicula, enim in fermentum accumsan,',
                  { placement: 'top' },
                ]}"
              >
                <!--              TODO: Icon system-->
                <!--              <Icon-->
                <!--                data="{icon[convertIconName(permission.iconName)]}"-->
                <!--                class="text-primary d-block m-auto" />-->
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
          {#each data.permission_groups as permissionGroup, index (permissionGroup)}
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
                      title="Eylemler"
                    >
                      <i class="fas fa-ellipsis-v"></i>
                    </a>
                    <div
                      aria-labelledby="permAction"
                      class="dropdown-menu dropdown-menu-left"
                    >
                      <a
                        class="dropdown-item"
                        data-target="#addEditPermGroup"
                        data-toggle="modal"
                        href="javascript:void(0);"
                        on:click="{() =>
                          onShowEditPermissionGroupButtonClick(
                            permissionGroup
                          )}"
                      >
                        <i class="fas fa-pencil-alt text-primary mr-1"></i>
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
                            )}"
                        >
                          <i class="fas fa-trash text-danger mr-1"></i>
                          Sil
                        </a>
                      {/if}
                    </div>
                  </div>
                  <div>
                    <h5 class="text-capitalize">{permissionGroup.name}</h5>
                    <div
                      class="d-flex flex-row flex-row-reverse justify-content-end align-items-center mr-3"
                    >
                      {#if permissionGroup.user_count > 3}
                        <small class="pl-1"
                          >+{permissionGroup.user_count - 3}</small
                        >
                      {/if}
                      {#each permissionGroup.users as user, index (user)}
                        <span
                          class="overlapping-avatar"
                          use:tooltip="{[user, { placement: 'bottom' }]}"
                        >
                          <a href="{base}/players/player/{user}">
                            <img
                              src="https://minotar.net/avatar/{user}"
                              width="32"
                              height="32"
                              alt="{user}"
                            />
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
                    disabled
                  />
                  <label
                    class="custom-control-label"
                    for="access_panel_{permissionGroup.name}"></label>
                </div>
              </td>
              {#each data.permissions as permission, index (permission)}
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
                      )}"
                    />
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

<script context="module">
  import { browser } from "$app/env";

  import ApiUtil from "$lib/api.util";
  import { showNetworkErrorOnCatch } from "$lib/store";

  let refreshable = false;

  async function loadData() {
    return new Promise((resolve, reject) => {
      ApiUtil.get("panel/initPage/permissionsPage")
        .then((response) => {
          if (response.data.result === "ok") {
            const data = response.data;

            resolve(data);
          } else if (response.data.result === "error") {
            const errorCode = response.data.error;

            reject(errorCode, response.data);
          }
        })
        .catch((e) => {
          console.log(e);
        });
    });
  }

  async function initData() {
    return new Promise((resolvePromise, rejectPromise) => {
      showNetworkErrorOnCatch((resolve, reject) => {
        loadData()
          .then((data) => {
            resolvePromise(data);
          })
          .catch((errorCode, data) => {
            reject();

            rejectPromise(errorCode, data);
          });
      });
    });
  }

  /**
   * @type {import('@sveltejs/kit').Load}
   */
  export async function load({ page, session }) {
    let output = {
      props: {
        data: {
          permissions: [],
          permission_groups: [],
          permission_group_perms: {},
        },
      },
    };

    if (browser && (page.path !== session.loadedPath || refreshable)) {
      // from another page
      await initData().then((data) => {
        output.props.data = {...output.props.data, ...data};
      });
      // .catch((errorCode, data) => {
      //   if (!!errorCode && errorCode === "PAGE_NOT_FOUND") {
      //     return null;
      //   }
      // });
    }

    if (page.path === session.loadedPath && !refreshable) {
      if (browser) refreshable = true;

      output.props.data = {...output.props.data, ...session.data};
    }

    return output;
  }
</script>

<script>
  import { base } from "$app/paths";

  import tooltip from "$lib/tooltip.util";

  import AddEditPermGroupModal, {
    show as showPermissionGroupAddEditModal,
    setCallback as setCallbackForPermissionGroupAddEditModal,
  } from "../../components/modals/AddEditPermGroupModal.svelte";

  import ConfirmDeletePermissionGroupModal, {
    setCallback as setDeletePermissionGroupModalCallback,
    show as showDeletePermissionGroupModal,
  } from "../../components/modals/ConfirmDeletePermissionGroupModal.svelte";

  export let data;

  let loadingPermissionsList = [];

  function reloadData() {
    showNetworkErrorOnCatch((resolve, reject) => {
      loadData()
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
      (typeof data.permission_group_perms[permissionGroup.id] === "undefined"
        ? false
        : !!data.permission_group_perms[permissionGroup.id].includes(
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
                typeof data.permission_group_perms[permissionGroup.id] ===
                "undefined"
              )
                data.permission_group_perms[permissionGroup.id] = [
                  permission.id,
                ];
              else
                data.permission_group_perms[permissionGroup.id].push(
                  permission.id
                );
            } else {
              data.permission_group_perms[permissionGroup.id].splice(
                data.permission_group_perms[permissionGroup.id].indexOf(
                  permission.id
                ),
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
    reloadData();
  });

  setDeletePermissionGroupModalCallback((permissionGroup) => {
    data.permission_groups.splice(
      data.permission_groups.indexOf(permissionGroup),
      1
    );
    data.permission_groups = data.permission_groups;

    if (typeof data.permission_group_perms[permissionGroup.id] !== "undefined")
      data.permission_group_perms.splice(
        data.permission_group_perms.indexOf(permissionGroup.id),
        1
      );
  });
</script>
