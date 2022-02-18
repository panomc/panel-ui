<div class="container">
  <!-- Action Menu -->
  <div
    class="row justify-content-between align-items-center mb-3 animate__animated animate__slideInUp">
    <div class="col-auto">
      <a class="btn btn-link" role="button" href="{base}/players">
        <i class="fas fa-arrow-left mr-1"></i>
        Oyuncular
      </a>
    </div>
    <div class="col-auto">
      <a
        href="#"
        class="btn btn-secondary"
        on:click="{() => onCreatePermissionGroupClick()}">
        <i class="fas fa-plus mr-1"></i>
        Yetki Grubu Oluştur
      </a>
    </div>
  </div>

  <div class="card">
    <div class="card-body table-responsive animate__animated animate__fadeIn">
      <table class="table table-borderless">
        <thead>
          <tr class="text-center text-muted align-top">
            <th scope="col"></th>
            <th
              scope="col"
              use:tooltip="{[
                'Panele erişebilir, ayarları ve panel içeriklerini görüntüleyebilir',
                { placement: 'top' },
              ]}">
              <small class="mb-0 fw-bolder">Panel Erişimi</small>
            </th>
            {#each data.permissions as permission, index (permission)}
              <th
                scope="col"
                use:tooltip="{[
                  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis vehicula, enim in fermentum accumsan,',
                  { placement: 'top' },
                ]}">
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
                  <div class="dropdown position-static mr-3">
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
                    <div
                      class="dropdown-menu dropdown-menu-start animate__animated animate__fadeIn">
                      <a
                        class="dropdown-item"
                        data-bs-toggle="modal"
                        href="#"
                        on:click="{() =>
                          onShowEditPermissionGroupButtonClick(
                            permissionGroup
                          )}">
                        <i class="fas fa-pencil-alt text-primary mr-1"></i>
                        Düzenle
                      </a>
                      {#if permissionGroup.name !== "admin"}
                        <a
                          class="dropdown-item"
                          data-target="#confirmDeletePermGroup"
                          data-toggle="modal"
                          href="#"
                          on:click="{() =>
                            onShowDeletePermissionGroupModalClick(
                              permissionGroup
                            )}">
                          <i class="fas fa-trash text-danger mr-1"></i>
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
                        <span
                          class="overlapping-avatar"
                          use:tooltip="{[user, { placement: 'bottom' }]}">
                          <a href="{base}/players/player/{user}">
                            <img
                              class="animate__animated animate__zoomIn"
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
              <td class="align-middle">
                <div
                  class="form-check form-switch d-flex justify-content-center">
                  <input
                    type="checkbox"
                    class="form-check-input"
                    id="access_panel_{permissionGroup.name}"
                    checked="true"
                    disabled />
                </div>
              </td>
              {#each data.permissions as permission, index (permission)}
                <td class="align-middle">
                  <div
                    class="form-check form-switch d-flex justify-content-center">
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
  import ApiUtil from "$lib/api.util";
  import { showNetworkErrorOnCatch } from "$lib/store";

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
          permission_groups: [],
          permission_group_perms: {},
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

  import tooltip from "$lib/tooltip.util";
  import { pageTitle } from "$lib/store";

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
      ApiUtil.post({
        path: "/api/panel/permission/set",
        body: {
          mode: mode,
          permission_group_id: permissionGroup.id,
          permission_id: permission.id,
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
