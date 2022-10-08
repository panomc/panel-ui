<article class="container">
  <!-- Action Menu -->
  <section
    class="row justify-content-between align-items-center mb-3 animate__animated animate__slideInUp">
    <div class="col-auto">
      <a
        href="{base}/posts{data.post.status === StatusTypes.TRASH
          ? '/trash'
          : data.post.status === StatusTypes.DRAFT
          ? '/draft'
          : ''}"
        class="btn btn-link"
        role="button">
        <i class="fas fa-arrow-left me-2"></i>
        Yazılar
      </a>
    </div>
    <div class="col-auto">
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
          <i class="fa-solid fa-floppy-disk"></i>
        </button>
      {/if}
      <a
        class="btn btn-link"
        role="button"
        target="_blank"
        href="{UI_URL}/preview/post/{data.post.id}">
        <i class="fas fa-eye me-2"></i>
        <span class="d-md-inline d-none">Görüntüle</span>
      </a>
      <button
        class="btn btn-secondary"
        type="button"
        class:disabled="{loading ||
          isEditorEmpty ||
          data.post.title.length === 0}"
        disabled="{loading || isEditorEmpty || data.post.title.length === 0}"
        on:click="{onSubmit}">
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
            class="form-control form-control-lg text-black border-0 p-0 mb-2"
            type="text"
            placeholder="Yazı başlığını girin"
            bind:value="{data.post.title}" />

          <div class="align-selft-center w-100 h-75">
            <!-- Editor -->
            <Editor
              bind:content="{data.post.text}"
              bind:isEmpty="{isEditorEmpty}" />
            <!-- Editor End -->
          </div>
        </div>
      </div>
    </div>

    <!-- Post Option Cards -->
    <div class="col-lg-3">
      <div class="card">
        <div class="card-body">
          <ul class="list-group p-0 m-0">
            <li class="list-group-item">
              Durum:
              {getStatusByPostStatus(data.post.status)}
            </li>
            <li class="list-group-item">
              Görüntülenme:
              {data.mode === Modes.CREATE ? "0" : data.post.views}
            </li>
            <li class="list-group-item">
              <form>
                {#if data.categoryCount === 0}
                  <p class="text-muted small">Hiç kategori oluşturulmamış.</p>
                {:else}
                  <select
                    class="form-control form-control-sm"
                    bind:value="{data.post.category}">
                    <option class="text-primary" value="{-1}"
                      >Kategorisiz</option>

                    {#each data.categories as category, index (category)}
                      <option value="{category.id}">{category.title}</option>
                    {/each}
                  </select>
                {/if}
              </form>
            </li>
            <li class="list-group-item">
              <a
                href="javascript:void(0);"
                data-bs-target="#setPostThumbnailModal"
                data-bs-toggle="modal"
                class="form-group">
                <img
                  src="{base}/assets/img/vanilla.png"
                  class="border rounded img-fluid"
                  title="Küçük Resim"
                  alt="Küçük Resim" />
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </section>
</article>

<SetPostThumbnailModal />
<AddEditPostCategoryModal />

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
      ApiUtil.get({
        path: `/api/panel/posts/${id}`,
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
        path: "/api/panel/post/categories",
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
   * @type {import('@sveltejs/kit').PageLoad}
   */
  export async function load(event, mode = DefaultMode) {
    const { parent } = event;
    await parent();

    let data = {
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
    };

    // if (event.stuff.NETWORK_ERROR) {
    //   output.props.data.NETWORK_ERROR = true;
    //
    //   return output;
    // }

    if (mode === Modes.EDIT) {
      await loadPost({ id: event.params.id || -1, request: event })
        .then((body) => {
          data.post = body.post;
        })
        .catch((body) => {
          if (body.error === "POST_NOT_FOUND") data = null;
        });
    }

    if (data !== null)
      await loadCategories({ request: event }).then((body) => {
        data = { ...data, ...body };
      });

    return data;
  }
</script>

<script>
  import { base } from "$app/paths";
  import { goto } from "$app/navigation";
  import { page } from "$app/stores";

  import { pageTitle, session, showNetworkErrorOnCatch } from "$lib/Store";
  import { UI_URL } from "$lib/variables";

  import SetPostThumbnailModal from "$lib/component/modals/SetPostThumbnailModal.svelte";

  import {
    setCallback as setDeletePostModalCallback,
    show as showDeletePostModal,
  } from "$lib/component/modals/ConfirmDeletePostModal.svelte";

  import AddEditPostCategoryModal, {
    show as showAddEditPostCategoryModal,
    setCallback as setCallbackForAddEditPostCategoryModal,
  } from "$lib/component/modals/AddEditPostCategoryModal.svelte";

  import Editor from "$lib/component/Editor.svelte";

  import { show as showToast } from "$lib/component/ToastContainer.svelte";

  import PostPublishedToast from "$lib/component/toasts/PostPublishedToast.svelte";
  import PostMovedToDraftToast from "$lib/component/toasts/PostMovedToDraftToast.svelte";

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
      const bodyHandler = (body) => {
        if (body.result === "ok") {
          loading = false;

          if (data.mode === Modes.CREATE) {
            goto(base + "/posts/post/" + body.id);
          }

          if (data.mode === Modes.EDIT) {
            data.post.status = 1;
          }

          showToast(PostPublishedToast, {
            postId: body.id,
            title: data.post.title,
          });

          resolve();
        } else if (body.result === "error") {
          loading = false;

          data.error = body.error;

          resolve();
        } else reject();
      };

      if (data.post.id === -1) {
        ApiUtil.post({
          path: "/api/panel/post",
          body: data.post,
          CSRFToken: $session.CSRFToken,
        })
          .then(bodyHandler)
          .catch(() => {
            reject();
          });

        return;
      }

      ApiUtil.put({
        path: `/api/panel/posts/${data.post.id}`,
        body: data.post,
        CSRFToken: $session.CSRFToken,
      })
        .then(bodyHandler)
        .catch(() => {
          reject();
        });
    });
  }

  function onDraftClick() {
    loading = true;

    showNetworkErrorOnCatch((resolve, reject) => {
      ApiUtil.put({
        path: `/api/panel/posts/${data.post.id}/status`,
        body: {
          to: "draft",
        },
        CSRFToken: $session.CSRFToken,
      })
        .then((body) => {
          if (body.result === "ok") {
            loading = false;

            goto(base + "/posts/draft");

            showToast(PostMovedToDraftToast, { title: data.post.title });

            resolve();
          } else reject();
        })
        .catch(() => {
          reject();
        });
    });
  }

  function onCreateCategoryClick() {
    showAddEditPostCategoryModal("create");
  }

  setCallbackForAddEditPostCategoryModal((routeFirstPage, category) => {
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
