<script context="module">
  import jquery from "jquery";
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

  export function show(newPlayer) {
    player.set(Object.assign({}, newPlayer));
    player.update((player) => {
      player.new_password = "";
      player.new_password_repeat = "";

      return player;
    });
    playerBackup.set(Object.assign({}, get(player)))

    errors.set(defaultErrors);

    jquery("#" + dialogID).modal({ backdrop: "static", keyboard: false });
  }

  export function hide() {
    hideCallback(get(player));

    jquery("#" + dialogID).modal("hide");
  }

  export function setCallback(newCallback) {
    callback = newCallback;
  }

  export function onHide(newCallback) {
    hideCallback = newCallback;
  }
</script>

<script>
  import { showNetworkErrorOnCatch, user } from "../../Store";
  import ApiUtil from "../../pano-ui/js/api.util";

  function refreshBrowserPage() {
    location.reload();
  }

  let loading = false;

  function onSubmit() {
    loading = true;

    showNetworkErrorOnCatch((resolve, reject) => {
      ApiUtil.post("panel/player/edit/info", get(player))
        .then((response) => {
          if (response.data.result === "ok") {
            if (get(playerBackup).username === get(user).username) {
              user.update((user) => {
                user.username = get(player).username
                user.email = get(player).email

                return user;
              })
            }

            loading = false;

            hide();

            player.update((player) => {
              player.new_password = "";
              player.new_password_repeat = "";

              return player;
            });

            callback(get(player));

            resolve();
          } else if (response.data.result === "NOT_EXISTS") {
            refreshBrowserPage();
          } else if (!!response.data.error) {
            loading = false;
            errors.set(response.data.error);

            resolve();
          } else reject();
        })
        .catch(() => {
          reject();
        });
    });
  }
</script>

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
          aria-label="Kapat"
          class="close"
          title="Pencereyi Kapat"
          type="button"
          on:click="{hide}">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <form on:submit|preventDefault="{onSubmit}">
        <div class="modal-body">
          <div class="form-group">
            <label for="username">Kullanıcı Adı:</label>
            <input
              class="form-control"
              id="username"
              type="text"
              bind:value="{$player.username}"
              class:border-danger="{!!$errors.username}" />
            {#if !!$errors["username"]}
              <small class="text-danger">
                {#if $errors["username"] === "INVALID"}
                  Kulanıcı adı geçerli değil
                {/if}
                {#if $errors["username"] === "EXISTS"}
                  Bu kullanıcı adı başka bir oyuncu tarafından kullanılıyor
                {/if}
              </small>
            {/if}
          </div>
          <div class="form-group">
            <label for="email">E-mail:</label>
            <input
              class="form-control"
              id="email"
              type="text"
              bind:value="{$player.email}"
              class:border-danger="{!!$errors.email}" />
            {#if !!$errors["email"]}
              <small class="text-danger">
                {#if $errors["email"] === "INVALID"}
                  E-Posta geçerli değil
                {/if}
                {#if $errors["email"] === "EXISTS"}
                  Bu E-Posta adresi başka bir oyuncu tarafından kullanılıyor
                {/if}
              </small>
            {/if}
          </div>
          <div class="form-group">
            <label for="newPassword">Yeni Şifre:</label>
            <input
              class="form-control"
              id="newPassword"
              type="password"
              bind:value="{$player.new_password}"
              class:border-danger="{!!$errors.newPassword}" />
            {#if !!$errors["newPassword"]}
              <small class="text-danger">
                {#if $errors["newPassword"] === "INVALID"}
                  Yeni şifre minimum 6 maksimum 128 karakterden oluşmalıdır
                {/if}
              </small>
            {/if}
          </div>
          <div class="form-group">
            <label for="newPasswordRepeat">Yeni Şifre Tekrarı:</label>
            <input
              class="form-control"
              id="newPasswordRepeat"
              type="password"
              bind:value="{$player.new_password_repeat}"
              class:border-danger="{!!$errors.newPasswordRepeat}" />
            {#if !!$errors["newPasswordRepeat"]}
              <small class="text-danger">
                {#if $errors["newPasswordRepeat"] === "NOT_MATCH"}
                  Yeni şifre ve yeni şifre tekrarı aynı değil
                {/if}
              </small>
            {/if}
          </div>
        </div>
        <div class="modal-footer">
          <button
            class="btn btn-block btn-primary"
            type="submit"
            class:disabled="{loading}"
            disabled="{loading}">
            Kaydet
          </button>
        </div>
      </form>
    </div>
  </div>
</div>
