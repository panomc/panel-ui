<!-- Posts Page -->
<article class="container">
  <!-- Action Menu -->
  <div class="row mb-3">
    <div class="col-md-4 col-6">
      <a class="btn btn-link" role="button" href="{base}/posts/categories">
        <i class="fas fa-list-alt mr-1"></i>
        Yazı Kategorileri
      </a>
    </div>
    <div class="col d-flex">
      <a
        class="btn btn-primary ml-auto"
        role="button"
        href="{base}/posts/create-post">
        <i class="fas fa-plus"></i>
        <span class="d-md-inline d-none ml-1">Yazı Oluştur</span>
      </a>
    </div>
  </div>

  <!-- All Posts -->

  <div class="card">
    <div class="card-body">
      <div class="row justify-content-between pb-3 align-items-center">
        <div class="col-md-6 col-12 text-md-left text-center">
          <h5 class="card-title mb-md-0">
            {data.posts_count}
            {data.pageType === PageTypes.PUBLISHED
              ? "Yayınlanmış"
              : data.pageType === PageTypes.DRAFT
              ? "Taslak"
              : data.pageType === PageTypes.TRASH
              ? "Çöp"
              : ""} Yazı
          </h5>
        </div>
        <div class="col-md-6 col-12 text-md-right text-center">
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
      {#if data.posts_count === 0}
        <div class="container text-center">
          <i class="fas fa-sticky-note fa-3x text-glass m-3"></i>
          <p class="text-gray">Burada içerik yok.</p>
        </div>
      {:else}
        <!-- Posts Table -->
        <div class="table-responsive">
          <table class="table mb-0">
            <thead>
              <tr>
                <th scope="col"></th>
                <th class="min-w-200px align-middle" scope="col">Başlık</th>
                <th scope="col align-middle">Kategori</th>
                <th scope="col align-middle">Yazar</th>
                <th scope="col align-middle">Görüntülenme</th>
                <th scope="col align-middle">Tarih</th>
              </tr>
            </thead>
            <tbody>
              {#each data.posts as post, index (post)}
                <tr class:bg-lightprimary="{post.selected}">
                  <th class="min-w-50px" scope="row">
                    <div class="dropdown position-absolute">
                      <a
                        class="btn btn-sm py-0"
                        aria-expanded="false"
                        aria-haspopup="true"
                        data-toggle="dropdown"
                        href="javascript:void(0);"
                        id="postAction"
                        title="Eylemler">
                        <i class="fas fa-ellipsis-v"></i>
                      </a>
                      <div
                        aria-labelledby="postAction"
                        class="dropdown-menu dropdown-menu-right">
                        <a
                          class="dropdown-item"
                          target="_blank"
                          href="/preview/post/{post.id}">
                          <i class="fas fa-eye text-primary mr-1"></i>
                          Görüntüle
                        </a>
                        {#if data.pageType !== PageTypes.DRAFT}
                          <a
                            class="dropdown-item"
                            href="javascript:void(0);"
                            on:click="{onMoveToDraft(post.id)}"
                            class:disabled="{buttonsLoading}"
                            disabled="{buttonsLoading}">
                            <span>
                              <i class="fas fa-bookmark text-primary mr-1"></i>
                              Taslaklara Taşı
                            </span>
                          </a>
                        {/if}

                        {#if data.pageType !== PageTypes.PUBLISHED}
                          <a
                            class="dropdown-item"
                            href="javascript:void(0);"
                            class:disabled="{buttonsLoading}"
                            disabled="{buttonsLoading}"
                            on:click="{onPublishClick(post.id)}">
                            <span>
                              <i class="fas fa-globe-americas text-primary mr-1"
                              ></i>
                              Yayınla
                            </span>
                          </a>
                        {/if}

                        <a
                          class="dropdown-item"
                          data-target="#confirmDeletePost"
                          data-toggle="modal"
                          href="javascript:void(0);"
                          on:click="{onDeletePostClick(post)}">
                          <i class="fas fa-trash text-danger mr-1"></i>
                          Sil
                        </a>
                      </div>
                    </div>
                  </th>
                  <td class="align-middle text-nowrap">
                    <a
                      href="{base + '/posts/post/' + post.id}"
                      title="Yazıyı Düzenle">
                      {post.title}
                    </a>
                  </td>
                  <td class="align-middle text-nowrap">
                    <span
                      class="badge badge-pill"
                      class:text-dark="{post.category.title === '-'}"
                      class:px-0="{post.category.title === '-'}"
                      style="{post.category.title === '-'
                        ? ''
                        : 'background: #' + post.category.color}">
                      {post.category.title === "-"
                        ? "Kategorisiz"
                        : post.category.title}
                    </span>
                  </td>
                  <td class="align-middle text-nowrap">
                    <a
                      href="{base}/players/player/{post.writer.username}"
                      use:tooltip="{[
                        post.writer.username,
                        { placement: 'top' },
                      ]}">
                      <img
                        alt="{post.writer.username}"
                        class="rounded-circle border"
                        height="32"
                        src="https://minotar.net/avatar/{post.writer.username}"
                        width="32" />
                    </a>
                  </td>
                  <td class="align-middle text-nowrap">{post.views}</td>
                  <td class="align-middle text-nowrap">
                    <Date time="{post.date}" />
                  </td>
                </tr>
              {/each}
            </tbody>
          </table>
        </div>
      {/if}
      <!-- Pagination -->
      <Pagination
        page="{data.page}"
        totalPage="{data.total_page}"
        on:firstPageClick="{() => reloadData(1)}"
        on:lastPageClick="{() => reloadData(data.total_page)}"
        on:pageLinkClick="{(event) => reloadData(event.detail.page)}" />
      <!-- Pagination End -->
    </div>
  </div>
</article>

<ConfirmDeletePostModal />

<script context="module">
  import { browser } from "$app/env";
  import { base } from "$app/paths";

  import ApiUtil from "$lib/api.util";
  import { showNetworkErrorOnCatch } from "$lib/store";

  let refreshable = false;

  export const PageTypes = Object.freeze({
    PUBLISHED: "published",
    DRAFT: "draft",
    TRASH: "trash",
  });

  export const DefaultPageType = PageTypes.PUBLISHED;

  export function getStatusFromPageType(pageType) {
    return pageType === PageTypes.PUBLISHED
      ? 1
      : pageType === PageTypes.DRAFT
      ? 2
      : 0;
  }

  async function loadData(page, pageType) {
    return new Promise((resolve, reject) => {
      ApiUtil.post("panel/initPage/postPage", {
        page: parseInt(page),
        page_type: getStatusFromPageType(pageType),
      })
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

  async function initData(page, pageType) {
    return new Promise((resolvePromise, rejectPromise) => {
      showNetworkErrorOnCatch((resolve, reject) => {
        loadData(page, pageType)
          .then((data) => {
            data.page = parseInt(page);
            data.pageType = pageType;

            resolvePromise(data);
          })
          .catch((errorCode, data) => {
            if (errorCode === "PAGE_NOT_FOUND") {
              resolve();
            } else {
              reject();
            }

            rejectPromise(errorCode, data);
          });
      });
    });
  }

  /**
   * @type {import('@sveltejs/kit').Load}
   */
  export async function load({ page, session }, pageType = DefaultPageType) {
    let output = {
      props: {
        data: {
          posts_count: 0,
          posts: [],
          total_page: 1,
          page: 1,
        },
      },
    };

    if (
      page.path === session.loadedPath &&
      !refreshable &&
      !!session.data &&
      session.data.error === "PAGE_NOT_FOUND"
    )
      return null;

    if (browser && (page.path !== session.loadedPath || refreshable)) {
      // from another page
      await initData(
        !!page.params.page ? parseInt(page.params.page) : 1,
        pageType
      )
        .then((data) => {
          output.props.data = data;
        })
        .catch((errorCode) => {
          if (!!errorCode && errorCode === "PAGE_NOT_FOUND") {
            return null;
          }
        });
    }

    if (page.path === session.loadedPath && !refreshable) {
      if (browser) refreshable = true;

      output.props.data = session.data;

      output.props.data.page = !!page.params.page
        ? parseInt(page.params.page)
        : 1;
      output.props.data.pageType = pageType;
    }

    return output;
  }
</script>

<script>
  import { goto } from "$app/navigation";

  import tooltip from "$lib/tooltip.util";

  import Pagination from "../components/Pagination.svelte";
  import Date from "../components/Date.svelte";

  import ConfirmDeletePostModal, {
    setCallback as setDeletePostModalCallback,
    show as showDeletePostModal,
    onHide as onDeletePostModalHide,
  } from "../components/modals/ConfirmDeletePostModal.svelte";

  export let data;

  let buttonsLoading = false;

  function refreshBrowserPage() {
    location.reload();
  }

  function onMoveToDraft(id) {
    buttonsLoading = true;

    showNetworkErrorOnCatch((resolve, reject) => {
      ApiUtil.post("panel/post/moveDraft", { id })
        .then((response) => {
          if (response.data.result === "ok") {
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
      ApiUtil.post("panel/post/onlyPublish", { id })
        .then((response) => {
          if (response.data.result === "ok") {
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
      loadData(page, pageType)
        .then((loadedData) => {
          resolve();

          if (page !== data.page) {
            goto(base + "/posts/" + data.pageType + "/" + page);
          } else {
            data = loadedData;

            data.page = page;
            data.pageType = pageType;
          }
        })
        .catch((errorCode) => {
          if (!!errorCode && errorCode === "PAGE_NOT_FOUND") {
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
