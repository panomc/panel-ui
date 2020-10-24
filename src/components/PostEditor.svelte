<style lang="scss" global>
  @import "node_modules/quill/dist/quill.snow";
</style>

<script>
  import Quill from "quill";
  import { onMount } from "svelte";
  import { route } from "routve";

  import SetPostThumbnailModal from "../components/modals/SetPostThumbnailModal.svelte";
  import { isPageInitialized, showNetworkErrorOnCatch } from "../Store";
  import ApiUtil from "../pano/js/api.util";
  import { extractContent } from "../util/text.util";
  import { basePath } from "../util/path.util";

  import ConfirmDeletePostModal, {
    setCallback as setDeletePostModalCallback,
    show as showDeletePostModal,
  } from "../components/modals/ConfirmDeletePostModal.svelte";

  import PostCategoriesAddEditModal, {
    show as showPostCategoriesAddEditModal,
    setCallback as setCallbackForPostCategoriesAddEditModal,
  } from "../components/modals/PostCategoriesAddEditModal.svelte";

  import Icon from "svelte-awesome";
  import {
    faEye,
    faArrowLeft,
    faBookmark,
    faTrash,
    faQuestionCircle,
    faPlus,
  } from "@fortawesome/free-solid-svg-icons";
  import {
    faStickyNote,
    faFolderOpen,
    faEdit,
    faImage,
  } from "@fortawesome/free-regular-svg-icons";

  const defaultPost = {
    id: -1,
    title: "",
    text: "",
    category: -1,
    status: -1,
    date: 0,
    imageCode: "",
  };

  let loading = false;
  let quill;
  let categoryCount = 0;
  let categories = [];
  let quillInitialized = false;
  let editorMode = "create";
  let postInitialized = false;
  let error = {};

  let post = defaultPost;

  export let postID = -1;

  function getStatusByPostStatus(status) {
    return status === 0
      ? "Çöp"
      : status === 1
      ? "Yayında"
      : status === 2
      ? "Taslak"
      : "Yeni";
  }

  function imageHandler() {
    const range = quill.getSelection();
    const value = prompt("What is the image URL");

    if (value) {
      quill.insertEmbed(range.index, "image", value, Quill.sources.USER);
    }
  }

  function setCategories(callback = () => {}) {
    showNetworkErrorOnCatch((resolve, reject) => {
      ApiUtil.get("panel/post/category/categories")
        .then((response) => {
          if (response.data.result === "ok") {
            categoryCount = response.data.category_count;
            categories = response.data.categories;

            isPageInitialized.set(true);

            callback();
            resolve();
          } else reject();
        })
        .catch(() => {
          reject();
        });
    });
  }

  function initPost() {
    quill.setHTML(post.text);
  }

  function initPage() {
    setCategories();
    initPost();
  }

  function setPostInitialized() {
    if (quillInitialized) {
      initPage();
    }

    postInitialized = true;
  }

  function setPost(postID) {
    if (postID === -1) {
      post = defaultPost;
      editorMode = "create";

      setPostInitialized();
    } else {
      editorMode = "edit";

      showNetworkErrorOnCatch((resolve, reject) => {
        ApiUtil.post("panel/initPage/editPost", { id: postID })
          .then((response) => {
            if (response.data.result === "ok") {
              post = response.data.post;

              setPostInitialized();

              resolve();
            } else if (response.data.result === "error") {
              const error = response.data.error;

              if (error === "POST_NOT_FOUND") {
                setPostInitialized();

                route("/panel/error-404");

                resolve();
              } else reject();
            } else reject();
          })
          .catch(() => {
            reject();
          });
      });
    }
  }

  function onSubmit() {
    loading = true;

    showNetworkErrorOnCatch((resolve, reject) => {
      ApiUtil.post("panel/post/publish", post)
        .then((response) => {
          if (response.data.result === "ok") {
            loading = false;

            if (post.id === -1) {
              route("/panel/posts/post/" + response.data.id);
            }

            //TODO: TOAST

            resolve();
          } else if (response.data.result === "error") {
            loading = false;

            error = response.data.error;

            resolve();
          } else reject();
        })
        .catch(() => {
          reject();
        });
    });
  }

  function onDraftClick() {
    loading = true;

    showNetworkErrorOnCatch((resolve, reject) => {
      ApiUtil.post("panel/post/moveDraft", post)
        .then((response) => {
          if (response.data.result === "ok") {
            loading = false;

            route("/panel/posts/draft");

            resolve();
          } else reject();
        })
        .catch(() => {
          reject();
        });
    });
  }

  function onCreateCategoryClick() {
    showPostCategoriesAddEditModal("create");
  }

  setCallbackForPostCategoriesAddEditModal((routeFirstPage, category) => {
    setCategories(() => {
      post.category = category.id;
    });
  });

  $: setPost(parseInt(postID));

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

    quill.on("text-change", () => {
      post.text = quill.getHTML();
    });

    quillInitialized = true;

    if (postInitialized) initPage();
  });

  setDeletePostModalCallback((post) => {
    if (post.status === 0) {
      route("/panel/posts");
    } else {
      route("/panel/posts/trash");
    }
  });
</script>

<!-- Create Post Subpage -->

<!-- Action Menu -->
<section class="row justify-content-between align-items-center mb-3">
  <div class="col-auto text-left">
    <a
      href="/panel/posts{post.status === 0 ? '/trash' : post.status === 2 ? '/draft' : ''}"
      class="btn btn-link"
      role="button"
    >
      <Icon data="{faArrowLeft}" class="mr-1" />
      Yazılar
    </a>
  </div>
  <div class="col text-right">
    <a
      class="btn btn-outline-primary"
      role="button"
      target="_blank"
      href="/preview/post/{post.id}"
    >
      <Icon data="{faEye}" />
      <span class="d-md-inline d-none ml-1">Görüntüle</span>
    </a>
    {#if editorMode === 'edit'}
      <button
        class="btn btn-link text-danger"
        type="button"
        on:click="{showDeletePostModal(post)}"
      >
        <Icon data="{faTrash}" />
      </button>
    {/if}
    {#if post.status !== 2 && post.id !== -1}
      <button
        class="btn btn-link"
        type="button"
        class:disabled="{loading}"
        disabled="{loading}"
        on:click="{onDraftClick}"
      >
        <Icon data="{faBookmark}" />
        <span class="d-md-inline d-none ml-1">Taslaklara Taşı</span>
      </button>
    {/if}
    <button
      class="btn btn-secondary"
      type="button"
      class:disabled="{loading || extractContent(post.text).length === 0 || post.title.length === 0}"
      disabled="{loading || extractContent(post.text).length === 0 || post.title.length === 0}"
      on:click="{onSubmit}"
    >
      <span>{post.status === 1 ? 'Güncelle' : 'Yayınla'}</span>
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
          class="form-control form-control-lg shadow-none display-3 mb-2"
          type="text"
          placeholder="Yazı Başlığı"
          bind:value="{post.title}"
        />

        <div class="align-selft-center w-100 h-75">
          <!-- Editor -->
          <div id="editorToolbar">
            <span class="ql-formats"> <select class="ql-size"></select> </span>
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
            <li class="list-group-item px-0 pt-0">
              <i
                aria-hidden="true"
                class="far fa-sticky-note text-primary fa-fw"
              ></i>

              <Icon data="{faStickyNote}" class="text-primary mr-1" />
              <b>Durum:</b>
              {getStatusByPostStatus(post.status)}
            </li>
            <li class="list-group-item px-0 pb-0">
              <Icon data="{faEye}" class="text-primary mr-1" />
              <b>Görüntülenme:</b>
              {post.id === -1 ? '0' : post.views}
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
          {#if categoryCount === 0}
            <p class="text-muted small">Hiç kategori oluşturulmamış.</p>
          {:else}
            <select
              class="form-control form-control-sm mb-3"
              bind:value="{post.category}"
            >
              <option class="text-primary" value="-1">Kategorisiz</option>

              {#each categories as category, index (category)}
                <option value="{category.id}">{category.title}</option>
              {/each}
            </select>
          {/if}
        </form>
        <button
          class="btn btn-link bg-lightprimary"
          type="button"
          on:click="{onCreateCategoryClick}"
        >
          <Icon data="{faPlus}" class="mr-1" />
          Kategori Oluştur
        </button>
      </div>
    </div>
    <div class="card">
      <div class="card-body">
        <h6>
          <Icon data="{faImage}" class="text-primary mr-1" />
          Küçük Resim:
        </h6>
        <a
          href="javascript:void(0);"
          data-target="#setPostThumbnailModal"
          data-toggle="modal"
          class="form-group"
        >
          <img
            src="{basePath() + '/assets/img/vanilla.png'}"
            class="border rounded img-fluid"
            title="Küçük Resim"
            alt="Küçük Resim"
          />
        </a>
      </div>
    </div>
  </div>
</section>

<ConfirmDeletePostModal />
<SetPostThumbnailModal />
<PostCategoriesAddEditModal />
