<script>
  import moment from "moment";
  import { getPath, route } from "routve";

  import Pagination from "../../components/Pagination.svelte";
  import ConfirmDeletePostModal, {
    setCallback as setDeletePostModalCallback,
    show as showDeletePostModal,
  } from "../../components/modals/ConfirmDeletePostModal.svelte";

  import { isPageInitialized, showNetworkErrorOnCatch } from "../../Store";
  import ApiUtil from "../../pano/js/api.util";
  import tooltip from "../../pano/js/tooltip.util";

  import Icon from "svelte-awesome";
  import { faListAlt } from "@fortawesome/free-regular-svg-icons";
  import {
    faStickyNote,
    faTrash,
    faPlus,
    faEllipsisV,
    faEye,
    faBookmark,
    faGlobeAmericas,
  } from "@fortawesome/free-solid-svg-icons";

  export let page = undefined;
  export let pageType = "published";

  let postsCount = 0;
  let posts = [];
  let totalPage = 1;
  let host = "";
  let buttonsLoading = false;

  function getStatusFromPageType() {
    return pageType === "published" ? 1 : pageType === "draft" ? 2 : 0;
  }

  function routePage(pageNumber, forceReload = false) {
    if (pageNumber !== page || forceReload) {
      showNetworkErrorOnCatch((resolve, reject) => {
        ApiUtil.post("panel/initPage/postPage", {
          page: pageNumber,
          page_type: getStatusFromPageType(),
        })
          .then((response) => {
            if (response.data.result === "ok") {
              postsCount = response.data.posts_count;
              posts = response.data.posts;
              totalPage = response.data.total_page;

              page = pageNumber;

              host = response.data.host;

              isPageInitialized.set(true);

              if (
                page === 1 &&
                getPath() !== "/panel/posts" &&
                getPath() !== "/panel/posts/" &&
                getPath() !== "/panel/posts/" + pageType &&
                getPath() !== "/panel/posts/" + pageType + "/"
              )
                route("/panel/posts/" + pageType + "/" + page);
              else if (page !== 1)
                route("/panel/posts/" + pageType + "/" + page);
            } else if (response.data.result === "error") {
              const errorCode = response.data.error;

              isPageInitialized.set(true);

              if (errorCode === "PAGE_NOT_FOUND") {
                route("/panel/error-404");
              }

              reject(errorCode);
            } else reject();
          })
          .catch(() => {
            reject();
          });
      });
    }
  }

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

            routePage(page, true);

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

            route("/panel/posts");

            resolve();
          } else refreshBrowserPage();
        })
        .catch(() => {
          reject();
        });
    });
  }

  setDeletePostModalCallback((post) => {
    if (post.status === 0) {
      routePage(page, true);
    } else {
      route("/panel/posts/trash");
    }
  });

  routePage(typeof page === "undefined" ? 1 : parseInt(page));
</script>

<!-- Action Menu -->
<div class="row mb-3">
  <div class="col-md-4 col-6">
    <a class="btn btn-link" role="button" href="/panel/posts/categories">
      <Icon data="{faListAlt}" class="mr-1" />
      Kategoriler
    </a>
  </div>
  <div class="col d-flex">
    <a
      class="btn btn-primary ml-auto"
      role="button"
      href="/panel/posts/create-post"
    >
      <Icon data="{faPlus}" />
      <span class="d-md-inline d-none ml-1">Yazı Oluştur</span>
    </a>
  </div>
</div>

<!-- All Posts -->

<div class="card">
  <div class="card-body">
    <div class="row justify-content-between pb-3 align-items-center">
      <div class="col-md-6 col-12 text-md-left text-center">
        <h5 class="card-title mb-md-0">{postsCount} Yazı</h5>
      </div>
      <div class="col-md-6 col-12 text-md-right text-center">
        <div class="btn-group">

          <a
            class:active="{pageType === 'published'}"
            class="btn btn-sm btn-outline-light btn-link"
            role="button"
            href="/panel/posts/published"
          >
            Yayınlanmış
          </a>
          <a
            class:active="{pageType === 'draft'}"
            class="btn btn-sm btn-outline-light btn-link"
            role="button"
            href="/panel/posts/draft"
          >
            Taslak
          </a>

          <a
            class:active="{pageType === 'trash'}"
            class="btn btn-sm btn-outline-light btn-link text-danger"
            role="button"
            href="/panel/posts/trash"
          >
            Çöp
          </a>
        </div>
      </div>
    </div>

    <!-- No Posts -->
    {#if postsCount === 0}
      <div class="container text-center">
        <Icon data="{faStickyNote}" scale="3" class="text-glass m-3" />
        <p class="text-gray">Burada içerik yok.</p>
      </div>
    {:else}
      <!-- Posts Table -->
      <div class="table-responsive">
        <table class="table mb-0">
          <thead>
            <tr>
              <th scope="col"></th>
              <th class="min-w-200px" scope="col">Başlık</th>
              <th scope="col">Kategori</th>
              <th scope="col">Yazar</th>
              <th scope="col">Görüntülenme</th>
              <th scope="col">Tarih</th>
            </tr>
          </thead>
          <tbody>
            {#each posts as post, index (post)}
              <tr>
                <th class="min-w-50px" scope="row">
                  <div class="dropdown position-absolute">
                    <a
                      class="btn btn-sm py-0"
                      aria-expanded="false"
                      aria-haspopup="true"
                      data-toggle="dropdown"
                      href="javascript:void(0);"
                      id="postAction"
                      title="Eylemler"
                    >
                      <Icon data="{faEllipsisV}" />
                    </a>
                    <div
                      aria-labelledby="postAction"
                      class="dropdown-menu dropdown-menu-right"
                    >
                      <a
                        class="dropdown-item"
                        target="_blank"
                        href="/preview/post/{post.id}"
                      >
                        <Icon data="{faEye}" class="text-primary mr-1" />
                        Görüntüle
                      </a>
                      {#if pageType !== 'draft'}
                        <a
                          class="dropdown-item"
                          href="javascript:void(0);"
                          on:click="{onMoveToDraft(post.id)}"
                          class:disabled="{buttonsLoading}"
                          disabled="{buttonsLoading}"
                        >
                          <span>
                            <Icon
                              data="{faBookmark}"
                              class="text-primary mr-1"
                            />
                            Taslaklara Taşı
                          </span>
                        </a>
                      {/if}

                      {#if pageType !== 'published'}
                        <a
                          class="dropdown-item"
                          href="javascript:void(0);"
                          class:disabled="{buttonsLoading}"
                          disabled="{buttonsLoading}"
                          on:click="{onPublishClick(post.id)}"
                        >
                          <span>
                            <Icon
                              data="{faGlobeAmericas}"
                              class="text-primary mr-1"
                            />
                            Yayınla
                          </span>
                        </a>
                      {/if}

                      <a
                        class="dropdown-item"
                        data-target="#confirmDeletePost"
                        data-toggle="modal"
                        href="javascript:void(0);"
                        on:click="{showDeletePostModal(post)}"
                      >

                        <Icon data="{faTrash}" class="text-danger mr-1" />
                        Sil
                      </a>
                    </div>
                  </div>
                </th>
                <td>
                  <a
                    href="{'/panel/posts/post/' + post.id}"
                    title="Yazıyı Düzenle"
                  >
                    {post.title}
                  </a>
                </td>
                <td>
                  <span
                    class="badge badge-sunflower badge-pill"
                    style="background: #{post.category.color}"
                  >
                    {post.category.title}
                  </span>
                </td>
                <td>
                  <a href="#" use:tooltip="{['top', post.writer.username]}">
                    <img
                      alt="{post.writer.username}"
                      class="rounded-circle border"
                      height="32"
                      src="https://minotar.net/avatar/{post.writer.username}"
                      width="32"
                    />
                  </a>
                </td>
                <td>{post.views}</td>
                <td>
                  {moment(parseInt(post.date)).format('DD/MM/YYYY, HH:mm')}
                </td>
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
    {/if}
    <!-- Pagination -->
    <Pagination
      {page}
      {totalPage}
      on:firstPageClick="{() => routePage(1)}"
      on:lastPageClick="{() => routePage(totalPage)}"
      on:pageLinkClick="{(event) => routePage(event.detail.page)}"
    />
  </div>
</div>

<ConfirmDeletePostModal />
