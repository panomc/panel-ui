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
          <i class="fa-solid fa-box-archive"></i>
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
                  <p class="text-muted small mb-0">
                    Hiç kategori oluşturulmamış.
                  </p>
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
            <li class="list-group-item form-group">
              Küçük Resim:
              {#if !isThumbnailRemoved && (thumbnail || data.post.thumbnailUrl)}
                <img
                  src="{thumbnail || data.post.thumbnailUrl}"
                  class="border rounded img-fluid mb-3"
                  title="Küçük Resim"
                  alt="Küçük Resim"
                  on:click="{() => thumbnailInput.click()}" />
              {:else}
                <div
                  class="container text-center animate__animated animate__zoomIn"
                  on:click="{() => thumbnailInput.click()}">
                  <i class="fas fa-image fa-3x text-dark text-opacity-25 m-3"
                  ></i>
                  <p class="text-gray">Küçük resim belirlenmedi.</p>
                </div>
              {/if}
              <input
                class="d-none"
                type="file"
                id="uploadPostThumbnailInput"
                bind:files="{thumbnailFiles}"
                on:change="{onThumbnailChange}"
                bind:this="{thumbnailInput}" />
            </li>
          </ul>
        </div>
      </div>
    </div>
  </section>
</article>

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
        thumbnailUrl: "",
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

  import {
    setCallback as setDeletePostModalCallback,
    show as showDeletePostModal,
  } from "$lib/component/modals/ConfirmDeletePostModal.svelte";

  import AddEditPostCategoryModal, {
    // show as showAddEditPostCategoryModal,
    setCallback as setCallbackForAddEditPostCategoryModal,
  } from "$lib/component/modals/AddEditPostCategoryModal.svelte";

  import Editor from "$lib/component/Editor.svelte";

  import { show as showToast } from "$lib/component/ToastContainer.svelte";

  import PostPublishedToast from "$lib/component/toasts/PostPublishedToast.svelte";
  import PostMovedToDraftToast from "$lib/component/toasts/PostMovedToDraftToast.svelte";

  export let data;

  let isEditorEmpty = true;
  let loading = false;

  let thumbnail;

  let isThumbnailSaved;
  let isThumbnailRemoved;

  let thumbnailInput;
  let thumbnailFiles = [];

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

  function onThumbnailChange(event) {
    isThumbnailSaved = false;
    isThumbnailRemoved = false;

    const reader = new FileReader();
    const newImage = event.target.files[0];

    reader.readAsDataURL(newImage);

    reader.onload = (e) => {
      thumbnail = e.target.result;
    };
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

          isThumbnailSaved = true;
          isThumbnailRemoved = false;
          thumbnailFiles = []

          resolve();
        } else if (body.result === "error") {
          loading = false;

          data.error = body.error;

          resolve();
        } else reject();
      };

      const body = new FormData();

      body.append("title", data.post.title);
      body.append("category", data.post.category);
      body.append("text", data.post.text);

      if (isThumbnailRemoved) {
        body.append("removeThumbnail", true);
      }else if (thumbnailFiles[0]) {
        body.append("thumbnail", thumbnailFiles[0]);
      }

      if (data.post.id === -1) {
        ApiUtil.post({
          path: "/api/panel/post",
          body,
        })
          .then(bodyHandler)
          .catch(() => {
            reject();
          });

        return;
      }

      ApiUtil.put({
        path: `/api/panel/posts/${data.post.id}`,
        body,
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

  function onRemoveThumbnailClick() {
    isThumbnailSaved = false;
    thumbnailFiles = [];
    thumbnail = null;
    isThumbnailRemoved = true;
  }

  // function onCreateCategoryClick() {
  //   showAddEditPostCategoryModal("create");
  // }

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
