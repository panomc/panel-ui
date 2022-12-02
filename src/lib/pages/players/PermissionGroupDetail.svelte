<article class="container">
  <!-- Action Menu -->
  <div
    class="row justify-content-between align-items-center mb-3 animate__animated animate__slideInUp">
    <div class="col-auto">
      <a class="btn btn-link" role="button" href="{base}/players/perm-groups">
        <i class="fas fa-arrow-left me-2"></i>
        Yetkiler
      </a>
    </div>
    <div class="col-auto">
      <button
        class="btn"
        class:btn-secondary="{data.mode === Modes.CREATE}"
        class:btn-primary="{data.mode === Modes.EDIT}"
        type="submit"
        class:disabled="{loading || !data.name}"
        disabled="{loading || !data.name}"
        on:click="{onSubmit}">
        {#if data.mode === Modes.EDIT}
          Kaydet
        {:else}
          Oluştur
        {/if}
      </button>
    </div>
  </div>

  <div class="row">
    <div class="col-lg-9 mb-lg-0 mb-3">
      <div class="card h-100">
        <div class="card-body">
          <input
            class:text-danger="{errors.name}"
            class:text-black="{!errors.name}"
            class="form-control form-control-lg border-0 text-black p-0 mb-2"
            placeholder="İsim"
            id="permissionGroupName"
            type="text"
            bind:value="{data.name}" />

          <form on:submit|preventDefault="{addUser}">
            <input
              class="form-control mb-3"
              id="addPlayerInput"
              bind:value="{username}"
              class:border-danger="{usernameInputError}"
              class:disabled="{checkingUsername}"
              placeholder="Oyuncu ekle..." />
          </form>

          {#each data.users as user, index (user)}
            <a
              use:tooltip="{['Kaldır', { placement: 'bottom' }]}"
              href="javascript:void(0);"
              on:click="{() => removeUser(index)}">
              <span
                class="badge rounded-pill bg-light link-primary text-center">
                <img
                  class="d-inline rounded-circle me-2"
                  src="https://crafthead.net/avatar/{user}"
                  alt="{user}"
                  width="28"
                  height="28" />
                {user}
              </span>
            </a>
          {/each}
        </div>
      </div>
    </div>
    <div class="col-lg-3">
      <div class="card">
        <div class="card-body">
          <div class="table-responsive">
            <table class="table table-sm table-hover table-borderless mb-0">
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
                    <td>
                      <div
                        class="form-check form-switch d-flex justify-content-center align-content-center">
                        <input
                          type="checkbox"
                          class="form-check-input"
                          id="{permission.name}"
                          checked="{isPermissionChecked(permission)}"
                          on:click="{() => onPermissionClick(permission)}"
                          disabled="{isPermissionDisabled(
                            permission,
                            loadingPermissions
                          )}" />
                      </div>
                    </td>
                  </tr>
                {/each}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</article>

<script context="module">
  import ApiUtil from "$lib/api.util.js";

  export const Modes = Object.freeze({
    EDIT: "edit",
    CREATE: "create",
  });

  export const DefaultMode = Modes.CREATE;

  async function loadData({ id, request }) {
    return new Promise((resolve, reject) => {
      ApiUtil.get({
        path: `/api/panel/permissionGroups/${id}`,
        request,
      }).then((body) => {
        if (body.result === "ok") {
          resolve(body);
        } else {
          reject(body);
        }
      });
    });
  }

  async function loadPermissions({ request }) {
    return new Promise((resolve, reject) => {
      ApiUtil.get({
        path: "/api/panel/permissions",
        request,
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
   * @type {import('@sveltejs/kit').PageLoad}
   */
  export async function load(event, mode = DefaultMode) {
    const { parent } = event;
    await parent();

    let data = {
      id: -1,
      name: "",
      users: [],
      permissions: [],
      permissionGroupPerms: [],
      mode,
    };

    if (mode === Modes.EDIT) {
      await loadData({
        id: event.params.id,
        request: event,
      })
        .then((body) => {
          data = { ...data, ...body };
        })
        .catch((body) => {
          if (body.error === "NOT_EXISTS") data = null;
        });
    }

    if (data !== null) {
      await loadPermissions({ request: event }).then((body) => {
        data = { ...data, ...body };
      });

      data.originalUsers = [...data.users];
    }

    return data;
  }
</script>

<script>
  import { base } from "$app/paths";

  import tooltip from "$lib/tooltip.util";
  import { showNetworkErrorOnCatch } from "$lib/Store.js";

  export let data;

  let loadingPermissions = [];
  let errors = [];
  let loading;

  let checkingUsername;
  let username = "";
  let usernameInputError;

  let addedUsers = [];
  let removedUsers = [];

  function isPermissionChecked(permission) {
    if (data.name === "admin") {
      return true;
    }

    return data.permissionGroupPerms.includes(permission.id);
  }

  function isPermissionDisabled(permission, loadingPermissions) {
    return data.name === "admin" || loadingPermissions[permission.name];
  }

  function refreshBrowserPage() {
    location.reload();
  }

  function onPermissionClick(permission) {
    loadingPermissions[permission.name] = true;

    const mode = isPermissionChecked(permission) ? "DELETE" : "ADD";

    showNetworkErrorOnCatch((resolve, reject) => {
      ApiUtil.put({
        path: `/api/panel/permissionGroups/${data.id}/permissions/${permission.id}`,
        body: {
          mode: mode,
        },
      })
        .then((body) => {
          if (body.result === "ok") {
            const includes = data.permissionGroupPerms.includes(permission.id);

            if (body.mode === "ADD" && !includes) {
              data.permissionGroupPerms.push(permission.id);
            } else if (body.mode === "DELETE" && includes) {
              data.permissionGroupPerms.splice(
                data.permissionGroupPerms.indexOf(permission.id),
                1
              );
            }

            loadingPermissions[permission.name] = false;

            resolve();
          } else if (body.error === "NOT_EXISTS") refreshBrowserPage();
          else reject();
        })
        .catch(() => {
          reject();
        });
    });
  }

  async function addUser() {
    errors = [];

    if (!username) {
      return;
    }

    if (data.users.indexOf(username) !== -1) {
      usernameInputError = true;

      return;
    }

    checkingUsername = true;

    showNetworkErrorOnCatch((resolve, reject) => {
      ApiUtil.get({
        path: `/api/panel/players/${username}/exists`,
      })
        .then((body) => {
          checkingUsername = false;

          if (body.result === "ok") {
            usernameInputError = false;

            data.users.push(username);
            data.users = data.users;

            if (removedUsers.indexOf(username) !== -1) {
              removedUsers.remove(removedUsers.indexOf(username));
            }

            if (data.originalUsers.indexOf(username) === -1) {
              addedUsers.push(username);
            }

            username = "";

            return;
          }

          errors = { error: body.error };
          usernameInputError = true;
          resolve();
        })
        .catch(() => reject());
    });
  }

  function removeUser(index) {
    const username = data.users[index];

    data.users = data.users.remove(index);

    if (addedUsers.indexOf(username) !== -1) {
      addedUsers.remove(addedUsers.indexOf(username));
    }

    if (data.originalUsers.indexOf(username) !== -1) {
      removedUsers.push(username);
    }
  }

  function onSubmit() {
    // loading = true;
    // errors.set([]);
    //
    // showNetworkErrorOnCatch((resolve, reject) => {
    //   const bodyHandler = (body) => {
    //     if (body.result === "ok") {
    //       loading = false;
    //
    //       hide();
    //
    //       callback(true);
    //
    //       resolve();
    //     } else if (body.result === "error") {
    //       loading = false;
    //
    //       if (body.error === "CANT_UPDATE_ADMIN_PERMISSION") {
    //         errors.set({ "error": body.error });
    //       } else {
    //         errors.set(
    //           typeof body.error === "string"
    //             ? { error: body.error }
    //             : body.error
    //         );
    //       }
    //
    //       resolve();
    //     } else reject();
    //   };
    //
    //   if (get(mode) === "edit") {
    //     ApiUtil.put({
    //       path: `/api/panel/permissionGroups/${get(permissionGroup).id}`,
    //       body: { ...$permissionGroup, addedUsers, removedUsers },
    //       CSRFToken: $session.CSRFToken,
    //     })
    //       .then(bodyHandler)
    //       .catch(() => {
    //         reject();
    //       });
    //
    //     return;
    //   }
    //
    //   ApiUtil.post({
    //     path: `/api/panel/permissionGroups`,
    //     body: { ...$permissionGroup, addedUsers },
    //     CSRFToken: $session.CSRFToken,
    //   })
    //     .then(bodyHandler)
    //     .catch(() => {
    //       reject();
    //     });
    // });
  }

  // function convertIconName(iconName) {
  //   const iconNameSplit = iconName.split("-");
  //   let restOfIconName = "";
  //
  //   iconNameSplit
  //     .filter((iconName, index) => index !== 0)
  //     .forEach((iconName) => {
  //       restOfIconName += iconName.capitalize();
  //     });
  //
  //   return iconNameSplit[0] + restOfIconName;
  // }

  // String.prototype.capitalize = function () {
  //   return this.charAt(0).toUpperCase() + this.slice(1);
  // };
</script>
