<!-- SetPostThumbnailModal Modal -->
<div
  id="{dialogID}"
  aria-hidden="true"
  class="modal fade"
  role="dialog"
  tabindex="-1">
  <div class="modal-dialog modal-dialog-centered" role="dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title">Küçük Resim Belirle</h5>
        <button
          aria-label="Kapat"
          class="btn-close"
          title="Pencereyi Kapat"
          type="button"
          on:click="{hide}">
        </button>
      </div>
      <div class="modal-body">
        <div class="container text-center animate__animated animate__zoomIn">
          {#if $image}
            <img src="{$image}" alt="Küçük resim önizlemesi" />
          {:else}
            <i class="fas fa-image fa-3x text-dark text-opacity-25 m-3"></i>
            <p class="text-gray">Küçük resim belirlenmedi.</p>
          {/if}
        </div>

        <div class="input-group">
          <input
            type="file"
            class="form-control"
            id="uploadPostThumbnailInput"
            bind:files="{$thumbnailFiles}"
            on:change="{onThumbnailChange}"
            bind:this="{$thumbnailInput}" />
          <label class="input-group-text" for="uploadPostThumbnailInput"
            >Upload</label>
        </div>
      </div>
      <div class="modal-footer">
        <button
          class="btn w-100 btn-primary"
          class:disabled="{isSaveButtonDisabled}"
          aria-disabled="{isSaveButtonDisabled}"
          disabled="{isSaveButtonDisabled}"
          on:click="{onSave}">Kaydet</button>
      </div>
    </div>
  </div>
</div>

<script context="module">
  import { writable, get } from "svelte/store";

  const dialogID = "setPostThumbnailModal";
  const post = writable({});
  const image = writable(null);
  const thumbnailInput = writable();
  const thumbnailFiles = writable([]);
  const isThumbnailRemoved = writable();

  let callback = (post, image) => {};
  let hideCallback = (post) => {};
  let modal;

  export function show(newPost, newImage, newIsThumbnailRemoved) {
    post.set(newPost);
    image.set(newIsThumbnailRemoved ? null : newImage || newPost.thumbnailUrl);

    isThumbnailRemoved.set(newIsThumbnailRemoved);

    thumbnailFiles.set([]);

    get(thumbnailInput).value = "";

    modal = new window.bootstrap.Modal(document.getElementById(dialogID), {
      backdrop: "static",
      keyboard: false,
    });

    modal.show();
  }

  export function hide() {
    hideCallback(get(post));

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
  $: isSaveButtonDisabled =
    ($isThumbnailRemoved ? null : $post.thumbnailUrl) === $image;

  function onThumbnailChange(event) {
    const reader = new FileReader();
    const newImage = event.target.files[0];

    reader.readAsDataURL(newImage);

    reader.onload = (e) => {
      $image = e.target.result;
    };
  }

  function onSave() {
    callback($post, $thumbnailFiles[0]);
    hide();
  }
</script>
