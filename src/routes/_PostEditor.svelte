<!--<style lang="scss" global>-->
<!--  @import "node_modules/quill/dist/quill.snow";-->
<!--</style>-->

<article class="container">
  <!-- Action Menu -->
  <section class="row justify-content-between align-items-center mb-3">
    <div class="col-auto text-left">
      <a
        href="{base}/posts{data.post.status === StatusTypes.TRASH
          ? '/trash'
          : data.post.status === StatusTypes.DRAFT
          ? '/draft'
          : ''}"
        class="btn btn-link"
        role="button">
        <i class="fas fa-arrow-left mr-1"></i>
        Yazılar
      </a>
    </div>
    <div class="col text-right">
      {#if data.mode === Modes.EDIT}
        <button
          class="btn btn-link text-danger"
          type="button"
          on:click="{showDeletePostModal(data.post)}">
          <i class="fas fa-trash"></i>
        </button>
      {/if}
      {#if data.post.status !== StatusTypes.DRAFT && data.mode === Modes.EDIT}
        <button
          class="btn btn-link"
          type="button"
          class:disabled="{loading}"
          disabled="{loading}"
          on:click="{onDraftClick}">
          <i class="fas fa-bookmark"></i>
          <span class="d-md-inline d-none ml-1">Taslaklara Taşı</span>
        </button>
      {/if}
      <a
        class="btn btn-link"
        role="button"
        target="_blank"
        href="/preview/post/{data.post.id}">
        <i class="fas fa-eye"></i>
        <span class="d-md-inline d-none ml-1">Görüntüle</span>
      </a>
      <button
        class="btn btn-secondary"
        type="button"
        class:disabled="{loading ||
          extractContent(data.post.text).length === 0 ||
          data.post.title.length === 0}"
        disabled="{loading ||
          extractContent(data.post.text).length === 0 ||
          data.post.title.length === 0}"
        on:click="{onSubmit}">
        <span
          >{data.post.status === StatusTypes.PUBLISHED
            ? "Güncelle"
            : "Yayınla"}</span>
      </button>
    </div>
  </section>

  <!-- Post & Post Options -->
  <section class="row">
    <!-- Post -->
    <div class="col-lg-9 d-flex flex-fill">
      <div class="card w-100">
        <div class="card-body">
          <input
            class="form-control form-control-lg display-3 mb-2"
            type="text"
            placeholder="Yazı Başlığı"
            bind:value="{data.post.title}" />

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

            <div id="editor"></div>
            <!-- Editor End -->
          </div>
        </div>
      </div>
    </div>

    <!-- Post Option Cards -->
    <div class="col-lg-3">
      <div class="card">
        <div class="p-2">
          <form>
            <ul class="list-group">
              <li class="list-group-item">
                <i class="fas fa-sticky-note text-primary mr-1"></i>
                <b>Durum:</b>
                {getStatusByPostStatus(data.post.status)}
              </li>
              <li class="list-group-item">
                <i class="fas fa-eye text-primary mr-1"></i>
                <b>Görüntülenme:</b>
                {data.mode === Modes.CREATE ? "0" : data.post.views}
              </li>
            </ul>
          </form>
        </div>
      </div>
      <div class="card">
        <div class="card-body">
          <h6>
            <i class="fas fa-folder-open text-primary mr-1"></i>
            Kategori:
          </h6>
          <form>
            {#if data.category_count === 0}
              <p class="text-muted small">Hiç kategori oluşturulmamış.</p>
            {:else}
              <select
                class="form-control form-control-sm mb-3"
                bind:value="{data.post.category}">
                <option class="text-primary" value="-1">Kategorisiz</option>

                {#each data.categories as category, index (category)}
                  <option value="{category.id}">{category.title}</option>
                {/each}
              </select>
            {/if}
          </form>
          <button
            class="btn btn-link btn-block bg-lightprimary"
            type="button"
            on:click="{onCreateCategoryClick}">
            <i class="fas fa-plus mr-1"></i>
            Kategori Oluştur
          </button>
        </div>
      </div>
      <div class="card">
        <div class="card-body">
          <h6>
            <i class="fas fa-image text-primary mr-1"></i>
            Küçük Resim:
          </h6>
          <a
            href="javascript:void(0);"
            data-target="#setPostThumbnailModal"
            data-toggle="modal"
            class="form-group">
            <img
              src="{base}/assets/img/vanilla.png"
              class="border rounded img-fluid"
              title="Küçük Resim"
              alt="Küçük Resim" />
          </a>
        </div>
      </div>
    </div>
  </section>
</article>

<ConfirmDeletePostModal />
<SetPostThumbnailModal />
<PostCategoriesAddEditModal />

<script context="module">
  import { browser } from "$app/env";

  import ApiUtil from "$lib/api.util";
  import { showNetworkErrorOnCatch } from "$lib/store";

  let refreshable = false;

  export const Modes = Object.freeze({
    EDIT: "edit",
    CREATE: "create",
  });

  export const StatusTypes = Object.freeze({
    PUBLISHED: 1,
    DRAFT: 2,
    TRASH: 0,
  });

  export const DefaultMode = Modes.CREATE;

  async function loadPost(id) {
    return new Promise((resolve, reject) => {
      ApiUtil.post("panel/initPage/editPost", {
        id: parseInt(id),
      })
        .then((response) => {
          if (response.data.result === "ok") {
            const post = response.data.post;

            resolve(post);
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

  async function loadCategories() {
    return new Promise((resolve, reject) => {
      ApiUtil.get("panel/post/category/categories")
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

  async function initData(id) {
    return new Promise((resolvePromise, rejectPromise) => {
      showNetworkErrorOnCatch((resolve, reject) => {
        loadPost(id)
          .then((data) => {
            data.id = id;

            resolvePromise(data);
          })
          .catch((errorCode, data) => {
            if (errorCode === "POST_NOT_FOUND") {
              resolve();
            } else {
              reject();
            }

            rejectPromise(errorCode, data);
          });
      });
    });
  }

  async function initCategories() {
    return new Promise((resolvePromise, rejectPromise) => {
      showNetworkErrorOnCatch((resolve, reject) => {
        loadCategories()
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
  export async function load({ page, session }, mode = DefaultMode) {
    let output = {
      props: {
        data: {
          post: {
            id: -1,
            title: "",
            text: "",
            category: -1,
            status: -1,
            date: 0,
            imageCode: "",
          },
          category_count: 0,
          categories: [],
          mode,
          error: {},
        },
      },
    };

    if (
      page.path === session.loadedPath &&
      !refreshable &&
      !!session.data &&
      session.data.error === "POST_NOT_FOUND"
    )
      return null;

    if (browser && (page.path !== session.loadedPath || refreshable)) {
      // from another page
      if (mode === Modes.EDIT)
        await initData(parseInt(page.params.id))
          .then((post) => {
            output.props.data.post = post;
          })
          .catch((errorCode) => {
            if (!!errorCode && errorCode === "POST_NOT_FOUND") {
              return null;
            }
          });
    }

    if (browser)
      await initCategories().then((data) => {
        output.props.data = { ...output.props.data, ...data };
      });

    if (page.path === session.loadedPath && !refreshable) {
      if (browser) refreshable = true;

      output.props.data.post = session.data.post;
    }

    return output;
  }
</script>

<script>
  import { base } from "$app/paths";
  import { goto } from "$app/navigation";

  import { extractContent } from "$lib/text.util";

  import SetPostThumbnailModal from "../components/modals/SetPostThumbnailModal.svelte";

  import ConfirmDeletePostModal, {
    setCallback as setDeletePostModalCallback,
    show as showDeletePostModal,
  } from "../components/modals/ConfirmDeletePostModal.svelte";

  import PostCategoriesAddEditModal, {
    show as showPostCategoriesAddEditModal,
    setCallback as setCallbackForPostCategoriesAddEditModal,
  } from "../components/modals/PostCategoriesAddEditModal.svelte";

  export let data;

  let loading = false;
  // let quill;
  // let Quill;

  function getStatusByPostStatus(status) {
    return status === StatusTypes.TRASH
      ? "Çöp"
      : status === StatusTypes.PUBLISHED
      ? "Yayında"
      : status === StatusTypes.DRAFT
      ? "Taslak"
      : "Yeni";
  }

  // function imageHandler() {
  //   const range = quill.getSelection();
  //   const value = prompt("What is the image URL");
  //
  //   if (value) {
  //     quill.insertEmbed(range.index, "image", value, Quill.sources.USER);
  //   }
  // }
  //
  // function initPost() {
  //   quill.setHTML(data.post.text);
  // }

  function onSubmit() {
    loading = true;

    showNetworkErrorOnCatch((resolve, reject) => {
      ApiUtil.post("panel/post/publish", data.post)
        .then((response) => {
          if (response.data.result === "ok") {
            loading = false;

            if (data.mode === Modes.CREATE) {
              goto(base + "/posts/post/" + response.data.id);
            }

            //TODO: TOAST

            resolve();
          } else if (response.data.result === "error") {
            loading = false;

            data.error = response.data.error;

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
      ApiUtil.post("panel/post/moveDraft", data.post)
        .then((response) => {
          if (response.data.result === "ok") {
            loading = false;

            goto(base + "/posts/draft");

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

  // onMount(async () => {
  //   const { default: Quill } = await import("quill");
  //
  //   quill = new Quill("#editor", {
  //     modules: {
  //       toolbar: {
  //         container: "#editorToolbar",
  //         handlers: {
  //           image: imageHandler,
  //         },
  //       },
  //     },
  //     theme: "snow",
  //   });
  //
  //   quill.setHTML = (html) => {
  //     quill.container.firstChild.innerHTML = html;
  //   };
  //
  //   quill.getHTML = () => {
  //     return quill.container.firstChild.innerHTML;
  //   };
  //
  //   quill.on("text-change", () => {
  //     data.post.text = quill.getHTML();
  //   });
  //
  //   initPost();
  // });

  setCallbackForPostCategoriesAddEditModal((routeFirstPage, category) => {
    showNetworkErrorOnCatch((resolve, reject) => {
      loadCategories()
        .then((loadedData) => {
          data.categories = loadedData.categories;
          data.category_count = loadedData.category_count;
          data.post.category = category.id;
        })
        .catch(() => {
          reject();
        });
    });
  });

  setDeletePostModalCallback((post) => {
    if (post.status === StatusTypes.TRASH) {
      goto(base + "/posts");
    } else {
      goto(base + "/posts/trash");
    }
  });
</script>
