<style lang="scss" global>
  @import "node_modules/quill/dist/quill.snow";
</style>

<script context="module">
  import { writable, get } from "svelte/store";

  const post = writable({
    id: -1,
    title: "Yazı başlığı 🖊",
    text: "",
    category: -1,
    status: -1,
    date: 0,
    imageCode: "",
  });
  const editorMode = writable("create");

  export function setPost(newPost) {
    post.set(newPost);
    editorMode.set("edit");
  }
</script>

<script>
  import Quill from "quill";
  import { onMount } from "svelte";

  import tooltip from "../pano/js/tooltip.util";
  import MoveToTrashPostConfirmationModal from "../components/modals/MoveToTrashPostConfirmationModal.svelte";

  import Icon from "svelte-awesome";
  import {
    faEye,
    faArrowLeft,
    faBookmark,
    faTrash,
    faQuestionCircle,
  } from "@fortawesome/free-solid-svg-icons";
  import {
    faStickyNote,
    faFolderOpen,
    faEdit,
    faImage,
  } from "@fortawesome/free-regular-svg-icons";

  let loading = false;
  let lengthEditorText = 0;
  let quill;

  function getStatusByPostStatus(status) {
    return status === 0
      ? "Çöp"
      : status === 1
      ? "Yayında"
      : status === 2
      ? "Taslak"
      : "-";
  }

  function getFormattedDate(date) {
    const dateFromNumberDate = new Date(date * 1000);

    return (
      dateFromNumberDate.getDate() +
      "." +
      (dateFromNumberDate.getMonth() + 1) +
      "." +
      dateFromNumberDate.getFullYear() +
      " - " +
      dateFromNumberDate.getHours() +
      ":" +
      dateFromNumberDate.getMinutes() +
      ":" +
      dateFromNumberDate.getSeconds()
    );
  }

  function imageHandler() {
    const range = quill.getSelection();
    const value = prompt("What is the image URL");
    if (value) {
      quill.insertEmbed(range.index, "image", value, Quill.sources.USER);
    }
  }

  onMount(() => {
    quill = new Quill("#editor", {
      modules: {
        toolbar: {
          container: "#editorToolbar",
          handlers: {
            image: imageHandler,
          },
        },
      },
      theme: "snow",
    });

    quill.setHTML = (html) => {
      quill.container.firstChild.innerHTML = html;
    };

    quill.getHTML = () => {
      return quill.container.firstChild.innerHTML;
    };
  });
</script>

<!-- Create Post Subpage -->

<!-- Action Menu -->
<section class="row justify-content-between align-items-center mb-3">
  <div class="col-auto text-left">
    <a
      href="/panel/posts{$post.status === 0 ? '/trash' : $post.status === 2 ? '/draft' : ''}"
      class="btn btn-link"
      role="button"
    >
      <Icon data="{faArrowLeft}" class="mr-1" />
      Yazılar
    </a>
  </div>
  <div class="col text-right">
    <a class="btn btn-outline-primary" role="button" target="_blank" href="/">
      <Icon data="{faEye}" />
      <span class="d-md-inline d-none ml-1">Görüntüle</span>
    </a>
    {#if $editorMode === 'edit'}
      <button
        class="btn btn-link text-danger"
        data-target="#moveToTrashPostConfirmationModal"
        data-toggle="modal"
        type="button"
      >
        <Icon data="{faTrash}" />
      </button>
    {/if}
    {#if $post.status !== 2 && $post.id !== -1}
      <button
        class="btn btn-link"
        type="button"
        class:disabled="{loading}"
        disabled="{loading}"
      >
        <Icon data="{faBookmark}" />
        <span class="d-md-inline d-none ml-1">Taslaklara Taşı</span>
      </button>
    {/if}
    <!--      @click="onSubmit"-->
    <button
      class="btn btn-secondary"
      type="button"
      class:disabled="{loading || lengthEditorText === 0 || $post.title.length === 0}"
      disabled="{loading || lengthEditorText === 0 || $post.title.length === 0}"
    >
      <span>{$post.status === 1 ? 'Güncelle' : 'Yayınla'}</span>
    </button>
  </div>
</section>

<!-- Post & Post Options -->
<section class="row">

  <!-- Post -->
  <div class="col-lg-9 d-flex flex-fill">
    <div class="card w-100">
      <div class="card-body d-flex flex-column">
        <input
          class="form-control font-weight-bolder text-muted mb-2"
          type="text"
          bind:value="{$post.title}"
        />

        <div class="align-selft-center w-100 h-75">
          <!-- Editor -->
          <div id="editorToolbar">
            <span class="ql-formats">
              <select class="ql-size"></select>
            </span>
            <span class="ql-formats">
              <button class="ql-bold"></button>
              <button class="ql-italic"></button>
              <button class="ql-underline"></button>
              <button class="ql-strike"></button>
            </span>
            <span class="ql-formats">
              <select class="ql-color"></select>
              <select class="ql-background"></select>
            </span>
            <span class="ql-formats">
              <button class="ql-header" value="1"></button>
              <button class="ql-header" value="2"></button>
              <button class="ql-blockquote"></button>
              <button class="ql-code-block"></button>
            </span>
            <span class="ql-formats">
              <button class="ql-list" value="ordered"></button>
              <button class="ql-list" value="bullet"></button>
              <button class="ql-indent" value="-1"></button>
              <button class="ql-indent" value="+1"></button>
            </span>
            <span class="ql-formats">
              <button class="ql-direction" value="rtl"></button>
              <select class="ql-align"></select>
            </span>
            <span class="ql-formats">
              <button class="ql-link"></button>
              <button class="ql-image"></button>
              <button class="ql-video"></button>
            </span>
          </div>

          <!--            @input="onEditorInput($event)"-->
          <div id="editor"></div>
          <!-- Editor End -->
        </div>

      </div>
    </div>
  </div>

  <!-- Post Option Cards -->
  <div class="col-lg-3">
    <div class="card">
      <div class="card-body">
        <form>
          <ul class="list-group">
            <li
              class="list-group-item px-0 pt-0"
              use:tooltip="{['left', 'Durum']}"
            >
              <i
                aria-hidden="true"
                class="far fa-sticky-note text-primary fa-fw"
              ></i>

              <Icon data="{faStickyNote}" class="text-primary mr-1" />
              <span class="font-weight-normal">
                {getStatusByPostStatus($post.status)}
              </span>
            </li>
            <li
              class="list-group-item px-0"
              use:tooltip="{['left', 'Son Düzenleme']}"
            >

              <Icon data="{faEdit}" class="text-primary mr-1" />
              <span class="font-weight-normal">
                {$post.date === 0 ? '-' : getFormattedDate($post.date)}
              </span>
            </li>
            <li
              class="list-group-item px-0 pb-0"
              use:tooltip="{['left', 'Görüntülenme']}"
            >
              <Icon data="{faEye}" class="text-primary mr-1" />
              <span class="font-weight-normal">0</span>
            </li>
          </ul>
        </form>
      </div>
    </div>
    <div class="card">
      <div class="card-body">
        <h6>
          <Icon data="{faFolderOpen}" class="text-primary mr-1" />
          Kategori:
        </h6>
        <form>
          <!--            v-if="category_count === 0"-->
          <div class="container text-center">
            <p class="text-muted small">Hiç kategori oluşturulmamış.</p>
          </div>

          <!--            v-if="category_count > 0"-->
          <!--            v-model="post.category"-->
          <select class="form-control form-control-sm mb-3">
            <option class="text-primary" disabled value="-1">
              Kategori Seç:
            </option>
            <!--              :key="index" :value="category.id" v-for="(category, index) in categories" v-text="category.title"-->
            <option></option>
          </select>
        </form>
      </div>
    </div>
    <div class="card">
      <div class="card-body">
        <h6>
          <Icon data="{faImage}" class="text-primary mr-1" />
          Küçük Resim:
        </h6>
        <div class="container text-center d-none">
          <p class="text-muted small">Küçük resim belirlenmedi.</p>
        </div>

        <!--          :src="post.imageCode"-->
        <!--          v-if="post.imageCode !== ''"-->
        <img
          alt="Küçük Resim"
          class="img-fluid rounded mb-3"
          height="auto"
          width="100%"
        />

        <!--          @change="readFile"-->
        <input
          accept="image/*"
          class="form-control-file"
          id="selectThumbnaiImage"
          type="file"
        />

        <!--          :class="{ 'text-danger': error.image, 'text-muted': !error.image }"-->
        <small>
          Küçük resim minimum 600x300 boyutlarında ve maksimum 1 MB olmalı.
        </small>
      </div>
    </div>
  </div>

</section>

<MoveToTrashPostConfirmationModal />
