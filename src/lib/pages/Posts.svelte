<!-- Posts Page -->
<article class="container">
  <!-- Action Menu -->
  <div
    class="row justify-content-between mb-3 animate__animated animate__slideInUp">
    <div class="col-auto">
      <a class="btn btn-link" role="button" href="{base}/posts/categories">
        <i class="fas fa-list-alt me-2"></i>
        Yazı Kategorileri
      </a>
    </div>
    <div class="col-auto">
      <a href="{base}/posts/create-post" class="btn btn-secondary ml-auto" role="button">
        <i class="fas fa-plus me-2"></i> Yazı Oluştur
      </a>
    </div>
  </div>

  <!-- All Posts -->

  <div class="card">
    <div class="card-body">
      <div class="row justify-content-between pb-3 align-items-center">
        <div class="col-md-auto col-12 text-md-left text-center">
          <h5 class="card-title mb-md-0">
            {data.postCount}
            {data.pageType === PageTypes.PUBLISHED
              ? "Yayınlanmış"
              : data.pageType === PageTypes.DRAFT
              ? "Taslak"
              : data.pageType === PageTypes.TRASH
              ? "Çöp"
              : ""} Yazı
          </h5>
        </div>
        <div class="col-md-auto col-12 text-md-right text-center">
          <div class="btn-group">
            <a
              class:active="{data.pageType === PageTypes.PUBLISHED}"
              class="btn btn-sm btn-outline-light btn-link"
              role="button"
              href="{base}/posts/published">
              Yayınlanmış
            </a>
            <a
              class:active="{data.pageType === PageTypes.DRAFT}"
              class="btn btn-sm btn-outline-light btn-link"
              role="button"
              href="{base}/posts/draft">
              Taslak
            </a>

            <a
              class:active="{data.pageType === PageTypes.TRASH}"
              class="btn btn-sm btn-outline-light btn-link text-danger"
              role="button"
              href="{base}/posts/trash">
              Çöp
            </a>
          </div>
        </div>
      </div>

      <!-- No Posts -->
      {#if data.postCount === 0}
        <div class="container text-center animate__animated animate__zoomIn">
          <i class="fa-solid fa-pen fa-3x text-dark text-opacity-25 m-3"></i>
          <p class="text-gray">Burada içerik yok.</p>
        </div>
      {:else}
        <!-- Posts Table -->
        <div class="table-responsive">
          <table class="table table-borderless table-hover mb-0">
            <thead>
              <tr>
                <th scope="col"></th>
                <th class="align-middle" scope="col">Başlık</th>
                <th scope="col" class="align-middle">Kategori</th>
                <th scope="col" class="align-middle">Görüntülenme</th>
                <th scope="col" class="align-middle">Yazar</th>
                <th scope="col" class="align-middle">Son Güncelleme</th>
              </tr>
            </thead>
            <tbody>
              {#each data.posts as post, index (post)}
                <PostRow
                  post="{post}"
                  pageType="{data.pageType}"
                  buttonsLoading="{buttonsLoading}"
                  on:moveToDraft="{(event) => onMoveToDraft(event.detail.id)}"
                  on:publish="{(event) => onPublishClick(event.detail.id)}"
                  on:deletePost="{(event) =>
                    onDeletePostClick(event.detail.post)}" />
              {/each}
            </tbody>
          </table>
        </div>
      {/if}
      <!-- Pagination -->
      <Pagination
        page="{data.page}"
        totalPage="{data.totalPage}"
        on:firstPageClick="{() => reloadData(1)}"
        on:lastPageClick="{() => reloadData(data.totalPage)}"
        on:pageLinkClick="{(event) => reloadData(event.detail.page)}" />
      <!-- Pagination End -->
    </div>
  </div>
</article>

<script context="module">
  import ApiUtil from "$lib/api.util.js";
  import { showNetworkErrorOnCatch } from "$lib/store.js";

  export const PageTypes = Object.freeze({
    PUBLISHED: "published",
    DRAFT: "draft",
    TRASH: "trash",
  });

  export const DefaultPageType = PageTypes.PUBLISHED;

  async function loadData({ page, pageType, request, CSRFToken }) {
    return new Promise((resolve, reject) => {
      ApiUtil.get({
        path: `/api/panel/posts?page=${page}&pageType=${pageType}`,
        request,
        CSRFToken,
      }).then((body) => {
        if (body.result === "ok") {
          const data = body;

          data.page = parseInt(page);
          data.pageType = pageType;

          resolve(data);
        } else {
          reject(body);
        }
      });
    });
  }

  /**
   * @type {import('@sveltejs/kit').Load}
   */
  export async function load(request, pageType = DefaultPageType) {
    let output = {
      props: {
        data: {
          postCount: 0,
          posts: [],
          totalPage: 1,
          page: 1,
        },
      },
    };

    if (request.stuff.NETWORK_ERROR) {
      output.props.data.NETWORK_ERROR = true;

      return output;
    }

    await loadData({ page: request.params.page || 1, pageType, request })
      .then((data) => {
        output.props.data = { ...output.props.data, ...data };
      })
      .catch((body) => {
        if (body.error === "PAGE_NOT_FOUND") output = null;
      });

    return output;
  }
</script>

<script>
  import { goto } from "$app/navigation";
  import { page, session } from "$app/stores";
  import { base } from "$app/paths";

  import { pageTitle } from "$lib/store.js";

  import Pagination from "$lib/component/Pagination.svelte";

  import {
    setCallback as setDeletePostModalCallback,
    show as showDeletePostModal,
    onHide as onDeletePostModalHide,
  } from "$lib/component/modals/ConfirmDeletePostModal.svelte";
  import PostRow from "$lib/component/PostRow.svelte";

  export let data;

  pageTitle.set(
    (data.pageType === PageTypes.PUBLISHED
      ? "Yayınlanmış" + " "
      : data.pageType === PageTypes.DRAFT
      ? "Taslak" + " "
      : data.pageType === PageTypes.TRASH
      ? "Çöp" + " "
      : "") + "Yazılar"
  );

  if (data.NETWORK_ERROR) {
    showNetworkErrorOnCatch((resolve, reject) => {
      loadData({
        page: $page.params.page || 1,
        pageType: data.pageType,
        CSRFToken: $session.CSRFToken,
      })
        .then((loadedData) => {
          data = loadedData;

          resolve();
        })
        .catch((body) => {
          if (body.error === "PAGE_NOT_FOUND") {
            goto(base + "/error-404");

            resolve();
          } else {
            reject();
          }
        });
    }, true);
  }

  let buttonsLoading = false;

  function refreshBrowserPage() {
    location.reload();
  }

  function onMoveToDraft(id) {
    buttonsLoading = true;

    showNetworkErrorOnCatch((resolve, reject) => {
      ApiUtil.put({
        path: `/api/panel/posts/${id}/status`,
        body: {
          to: "draft",
        },
        CSRFToken: $session.CSRFToken,
      })
        .then((body) => {
          if (body.result === "ok") {
            buttonsLoading = false;

            reloadData();

            resolve();
          } else refreshBrowserPage();
        })
        .catch(() => {
          reject();
        });
    });
  }

  function onPublishClick(id) {
    buttonsLoading = true;

    showNetworkErrorOnCatch((resolve, reject) => {
      ApiUtil.put({
        path: `/api/panel/posts/${id}/status`,
        body: {
          to: "publish",
        },
        CSRFToken: $session.CSRFToken,
      })
        .then((body) => {
          if (body.result === "ok") {
            buttonsLoading = false;

            goto(base + "/posts");

            resolve();
          } else refreshBrowserPage();
        })
        .catch(() => {
          reject();
        });
    });
  }

  function reloadData(page = data.page, pageType = data.pageType) {
    showNetworkErrorOnCatch((resolve, reject) => {
      loadData({ page, pageType, CSRFToken: $session.CSRFToken })
        .then((loadedData) => {
          resolve();

          if (page !== data.page) {
            goto(base + "/posts/" + data.pageType + "/" + page);
          } else {
            data = loadedData;
          }
        })
        .catch((body) => {
          if (body.error === "PAGE_NOT_FOUND") {
            resolve();

            reloadData(page - 1);
          } else {
            reject();
          }
        });
    });
  }

  function onDeletePostClick(post) {
    data.posts[data.posts.indexOf(post)].selected = true;

    showDeletePostModal(post);
  }

  setDeletePostModalCallback((post) => {
    if (data.posts.indexOf(post) !== -1)
      data.posts[data.posts.indexOf(post)].selected = false;

    reloadData();
  });

  onDeletePostModalHide((post) => {
    if (data.posts.indexOf(post) !== -1)
      data.posts[data.posts.indexOf(post)].selected = false;
  });
</script>
