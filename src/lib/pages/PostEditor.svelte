<article class="container">
  <!-- Action Menu -->
  <section
    class="row justify-content-between align-items-center mb-3 animate__animated animate__slideInUp"
  >
    <div class="col-auto">
      <a
        href="{base}/posts{data.post.status === StatusTypes.TRASH
          ? '/trash'
          : data.post.status === StatusTypes.DRAFT
          ? '/draft'
          : ''}"
        class="btn btn-link"
        role="button"
      >
        <i class="fas fa-arrow-left mr-1"></i>
        Yazılar
      </a>
    </div>
    <div class="col-auto">
      {#if data.mode === Modes.EDIT}
        <button
          class="btn btn-link text-danger"
          type="button"
          on:click="{showDeletePostModal(data.post)}"
        >
          <i class="fas fa-trash"></i>
        </button>
      {/if}
      {#if data.post.status !== StatusTypes.DRAFT && data.mode === Modes.EDIT}
        <button
          class="btn btn-link"
          type="button"
          class:disabled="{loading}"
          disabled="{loading}"
          on:click="{onDraftClick}"
        >
          <i class="fas fa-bookmark"></i>
          <span class="d-md-inline d-none ml-1">Taslaklara Taşı</span>
        </button>
      {/if}
      <a
        class="btn btn-link"
        role="button"
        target="_blank"
        href="{UI_URL}/preview/post/{data.post.id}"
      >
        <i class="fas fa-eye"></i>
        <span class="d-md-inline d-none ml-1">Görüntüle</span>
      </a>
      <button
        class="btn btn-secondary"
        type="button"
        class:disabled="{loading ||
          isEditorEmpty ||
          data.post.title.length === 0}"
        disabled="{loading || isEditorEmpty || data.post.title.length === 0}"
        on:click="{onSubmit}"
      >
        <span>
          {data.post.status === StatusTypes.PUBLISHED ? "Güncelle" : "Yayınla"}
        </span>
      </button>
    </div>
  </section>

  <!-- Post & Post Options -->
  <section class="row animate__animated animate__fadeIn">
    <!-- Post -->
    <div class="col-lg-9 d-flex flex-fill">
      <div class="card w-100">
        <div class="card-body">
          <input
            class="form-control form-control-lg display-3 mb-2"
            type="text"
            placeholder="Başlık"
            bind:value="{data.post.title}"
          />

          <div class="align-selft-center w-100 h-75">
            <!-- Editor -->
            <Editor
              bind:content="{data.post.text}"
              bind:isEmpty="{isEditorEmpty}"
            />
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
                <i class="fas fa-pen text-primary mr-1"></i>
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
            {#if data.categoryCount === 0}
              <p class="text-muted small">Hiç kategori oluşturulmamış.</p>
            {:else}
              <select
                class="form-control form-control-sm"
                bind:value="{data.post.category}"
              >
                <option class="text-primary" value="{-1}">Kategorisiz</option>

                {#each data.categories as category, index (category)}
                  <option value="{category.id}">{category.title}</option>
                {/each}
              </select>
            {/if}
          </form>
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
            data-bs-target="#setPostThumbnailModal"
            data-bs-toggle="modal"
            class="form-group"
          >
            <img
              src="{base}/assets/img/vanilla.png"
              class="border rounded img-fluid"
              title="Küçük Resim"
              alt="Küçük Resim"
            />
          </a>
        </div>
      </div>
    </div>
  </section>
</article>

<SetPostThumbnailModal />
<PostCategoriesAddEditModal />

<script context="module">
  import ApiUtil from "$lib/api.util";

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

  async function loadPost({ id, request, CSRFToken }) {
    return new Promise((resolve, reject) => {
      ApiUtil.post({
        path: "/api/panel/initPage/editPost",
        body: {
          id: parseInt(id),
        },
        request,
        CSRFToken,
      }).then((body) => {
        if (body.result === "ok") {
          const data = body;

          data.id = parseInt(id);

          resolve(data);
        } else {
          reject(body);
        }
      });
    });
  }

  async function loadCategories({ request, CSRFToken }) {
    return new Promise((resolve, reject) => {
      ApiUtil.get({
        path: "/api/panel/post/category/categories",
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
  export async function load(request, mode = DefaultMode) {
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
          categoryCount: 0,
          categories: [],
          mode,
          error: {},
        },
      },
    };

    if (request.stuff.NETWORK_ERROR) {
      output.props.data.NETWORK_ERROR = true;

      return output;
    }

    if (mode === Modes.EDIT) {
      await loadPost({ id: request.params.id || -1, request })
        .then(async (body) => {
          output.props.data.post = body.post;
        })
        .catch((body) => {
          if (body.error === "POST_NOT_FOUND") output = null;
        });
    }

    if (output !== null)
      await loadCategories({ request }).then((body) => {
        output.props.data = { ...output.props.data, ...body };
      });

    return output;
  }
</script>

<script>
  import { base } from "$app/paths";
  import { goto } from "$app/navigation";
  import { session, page } from "$app/stores";

  import { pageTitle, showNetworkErrorOnCatch } from "$lib/store";
  import { UI_URL } from "$lib/variables";

  import SetPostThumbnailModal from "$lib/component/modals/SetPostThumbnailModal.svelte";

  import {
    setCallback as setDeletePostModalCallback,
    show as showDeletePostModal,
  } from "$lib/component/modals/ConfirmDeletePostModal.svelte";

  import PostCategoriesAddEditModal, {
    show as showPostCategoriesAddEditModal,
    setCallback as setCallbackForPostCategoriesAddEditModal,
  } from "$lib/component/modals/PostCategoriesAddEditModal.svelte";

  import Editor from "$lib/component/Editor.svelte";

  export let data;

  let isEditorEmpty = true;
  let loading = false;

  pageTitle.set(
    data.mode === Modes.EDIT ? "Yazıyı Düzenle" : "Yeni Yazı Oluştur"
  );

  if (data.NETWORK_ERROR) {
    showNetworkErrorOnCatch(async (resolve, reject) => {
      if (data.mode === Modes.EDIT) {
        await loadPost({
          id: $page.params.id || -1,
          CSRFToken: $session.CSRFToken,
        })
          .then(async (body) => {
            data.post = body.post;

            resolve();
          })
          .catch((body) => {
            if (body.error === "POST_NOT_FOUND") {
              resolve();

              goto(base + "/error-404");
            } else reject();
          });
      } else {
        resolve();
      }

      showNetworkErrorOnCatch((resolve, reject) => {
        loadCategories({ CSRFToken: $session.CSRFToken })
          .then((body) => {
            data = { ...data, ...body };
            resolve();
          })
          .catch(() => {
            reject();
          });
      });
    }, true);
  }

  function getStatusByPostStatus(status) {
    return status === StatusTypes.TRASH
      ? "Çöp"
      : status === StatusTypes.PUBLISHED
      ? "Yayınlanmış"
      : status === StatusTypes.DRAFT
      ? "Taslak"
      : "Yeni";
  }

  function onSubmit() {
    loading = true;

    showNetworkErrorOnCatch((resolve, reject) => {
      ApiUtil.post({
        path: "/api/panel/post/publish",
        body: data.post,
        CSRFToken: $session.CSRFToken,
      })
        .then((body) => {
          if (body.result === "ok") {
            loading = false;

            if (data.mode === Modes.CREATE) {
              goto(base + "/posts/post/" + body.id);
            }

            //TODO: TOAST

            resolve();
          } else if (body.result === "error") {
            loading = false;

            data.error = body.error;

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
      ApiUtil.post({
        path: "/api/panel/post/moveDraft",
        body: data.post,
        CSRFToken: $session.CSRFToken,
      })
        .then((body) => {
          if (body.result === "ok") {
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

  setCallbackForPostCategoriesAddEditModal((routeFirstPage, category) => {
    showNetworkErrorOnCatch((resolve, reject) => {
      loadCategories()
        .then((loadedData) => {
          data.categories = loadedData.categories;
          data.categoryCount = loadedData.categoryCount;
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
