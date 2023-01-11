<!-- Edit Player Modal -->
<div
  aria-hidden="true"
  class="modal fade"
  id="{dialogID}"
  role="dialog"
  tabindex="-1">
  <div class="modal-dialog modal-dialog-centered" role="dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title">Oyuncu Bilgilerini Düzenle</h5>
        <button
          title="Pencereyi Kapat"
          type="button"
          class="btn-close"
          data-bs-dismiss="modal"
          on:click="{hide}"></button>
      </div>
      <form on:submit|preventDefault="{onSubmit}">
        <div class="modal-body">
          <div class="row">
            <div class="col-12">
              <input
                class="form-control form-control-lg text-black border-0 p-0"
                id="username"
                placeholder="İsim"
                type="text"
                bind:value="{$player.username}"
                class:is-invalid="{!!$errors.username}"
                aria-describedby="validationEditUsernameInModal" />
              <div id="validationEditUsernameInModal" class="invalid-feedback">
                {#if !!$errors["username"]}
                  {#if $errors["username"] === "INVALID"}
                    Kulanıcı adı geçerli değil
                  {/if}
                  {#if $errors["username"] === "EXISTS"}
                    Bu kullanıcı adı başka bir oyuncu tarafından kullanılıyor
                  {/if}
                {/if}
              </div>
            </div>
            <div class="col-12 mb-3"></div>
            <div class="col-12 mb-3">
              <label for="email">E-Posta</label>
              <input
                class="form-control"
                id="email"
                type="text"
                bind:value="{$player.email}"
                class:is-invalid="{!!$errors.email}"
                aria-describedby="validationEditEmailInModal" />
              <div id="validationEditEmailInModal" class="invalid-feedback">
                {#if !!$errors["email"]}
                  {#if $errors["email"] === "INVALID"}
                    E-Posta geçerli değil
                  {/if}
                  {#if $errors["email"] === "EXISTS"}
                    Bu E-Posta adresi başka bir oyuncu tarafından kullanılıyor
                  {/if}
                {/if}
              </div>
            </div>
            <div class="col-6 mb-3">
              <label for="newPassword">Yeni Şifre</label>
              <input
                class="form-control"
                id="newPassword"
                type="password"
                bind:value="{$player.newPassword}"
                class:is-invalid="{!!$errors.newPassword}"
                aria-describedby="validationEditPasswordInModal" />
              <div id="validationEditPasswordInModal" class="invalid-feedback">
                {#if !!$errors["newPassword"]}
                  {#if $errors["newPassword"] === "INVALID"}
                    Yeni şifre minimum 6 maksimum 128 karakterden oluşmalıdır
                  {/if}
                {/if}
              </div>
            </div>
            <div class="col-6 mb-3">
              <label for="newPasswordRepeat">Yeni Şifre Tekrarı</label>
              <input
                class="form-control"
                id="newPasswordRepeat"
                type="password"
                bind:value="{$player.newPasswordRepeat}"
                class:is-invalid="{!!$errors.newPasswordRepeat}"
                aria-describedby="validationEditNewPasswordInModal" />
              <div
                id="validationEditNewPasswordInModal"
                class="invalid-feedback">
                {#if !!$errors["newPasswordRepeat"]}
                  {#if $errors["newPasswordRepeat"] === "NOT_MATCH"}
                    Şifreler aynı değil
                  {/if}
                {/if}
              </div>
            </div>
            <div class="col-6">
              <div class="form-check form-switch">
                <input
                  class="form-check-input"
                  type="checkbox"
                  aria-checked="true"
                  role="switch"
                  id="emailVerifiedCheckbox"
                  bind:checked="{$player.canCreateTicket}"
                  disabled="{$user.username === $player.username}" />
                <label class="form-check-label" for="emailVerifiedCheckbox"
                  >Talep oluşturabilir</label>
              </div>
            </div>
            <div class="col-6">
              <div class="form-check form-switch">
                <input
                  class="form-check-input"
                  type="checkbox"
                  role="switch"
                  aria-checked="true"
                  id="canCreateTicketCheckbox"
                  bind:checked="{$player.isEmailVerified}"
                  disabled="{$user.username === $player.username}" />
                <label class="form-check-label" for="canCreateTicketCheckbox"
                  >E-postası doğrulandı</label>
              </div>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button
            class="btn btn-primary w-100"
            type="submit"
            class:disabled="{loading}">
            Kaydet
          </button>
        </div>
      </form>
    </div>
  </div>
</div>

<script context="module">
  import { writable, get } from "svelte/store";

  const dialogID = "editPlayerModal";
  const player = writable({});
  const playerBackup = writable({});
  const defaultErrors = {
    "username": "",
    "email": "",
    "newPassword": "",
    "newPasswordRepeat": "",
  };
  const errors = writable(defaultErrors);

  let callback = (player) => {};
  let hideCallback = (player) => {};
  let modal;

  export function show(newPlayer) {
    player.set(Object.assign({}, newPlayer));
    player.update((player) => {
      player.newPassword = "";
      player.newPasswordRepeat = "";

      return player;
    });
    playerBackup.set(Object.assign({}, get(player)));

    errors.set(defaultErrors);

    modal = new window.bootstrap.Modal(document.getElementById(dialogID), {
      backdrop: "static",
      keyboard: false,
    });
    modal.show();
  }

  export function hide() {
    hideCallback(get(player));

    modal.hide();
  }

  export function setCallback(newCallback) {
    callback = newCallback;
  }

  export function onHide(newCallback) {
    hideCallback = newCallback;
  }
</script>

<script>
  import { showNetworkErrorOnCatch } from "$lib/Store";
  import { page } from "$app/stores";
  import ApiUtil from "$lib/api.util";

  import { show as showToast } from "$lib/component/ToastContainer.svelte";
  import PlayerInfoSavedSuccessToast from "$lib/component/toasts/PlayerInfoSavedSuccessToast.svelte";

  function refreshBrowserPage() {
    location.reload();
  }

  let loading = false;

  const { user } = $page.data;

  function onSubmit() {
    loading = true;

    showNetworkErrorOnCatch((resolve, reject) => {
      ApiUtil.put({
        path: `/api/panel/players/${get(player).id}`,
        body: get(player),
      })
        .then((body) => {
          if (body.result === "ok") {
            if (get(playerBackup).username === get(user).username) {
              user.update((user) => {
                user.username = get(player).username;
                user.email = get(player).email;

                return user;
              });
            }

            loading = false;

            hide();

            showToast(PlayerInfoSavedSuccessToast);

            player.update((player) => {
              player.newPassword = "";
              player.newPasswordRepeat = "";

              return player;
            });

            callback(get(player));

            resolve();
          } else if (body.result === "NOT_EXISTS") {
            refreshBrowserPage();
          } else if (body.errors) {
            loading = false;
            errors.set(body.errors);

            resolve();
          } else if (body.error) {
            location.reload();
          } else reject();
        })
        .catch(() => {
          reject();
        });
    });
  }
</script>
