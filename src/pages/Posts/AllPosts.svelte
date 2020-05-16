<script>
  import Pagination from "../../components/Pagination.svelte";

  import { isPageInitialized, showNetworkErrorOnCatch } from "../../Store";
  import ApiUtil from "../../util/api.util";
  import tooltip from "../../util/tooltip.util";

  import { getPath, route } from "routve";

  export let page = undefined;
  export let pageType = "published";

  let postsCount = 0;
  let posts = [];
  let totalPage = 1;
  let host = "";

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

  routePage(typeof page === "undefined" ? 1 : parseInt(page));
</script>

<!-- Action Menu -->
<div class="row mb-3">
  <div class="col-md-4 col-6">
    <a class="btn btn-link" role="button" href="/panel/posts/categories">
      <i aria-hidden="true" class="far fa-list-alt fa-fw"></i>
      <span class="d-md-inline d-none">Kategoriler</span>
    </a>
  </div>
  <div class="col text-right">
    <a class="btn btn-primary" role="button" href="/panel/posts/create-post">
      <i aria-hidden="true" class="fa fa-plus fa-fw"></i>
      <span class="d-md-inline d-none">Yazı Oluştur</span>
    </a>
  </div>
</div>

<!-- All Posts -->

<div class="card">
  <div class="card-body">
    <div class="row justify-content-between">
      <div class="col-md-6 col-12 text-md-left text-center">
        <h5 class="card-title">
          {postsCount} Yazı -
          <span class="text-primary">{page}/{totalPage}</span>
        </h5>
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
        <i
          aria-hidden="true"
          class="far fa-sticky-note fa-4x text-glass m-3"
        ></i>
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
                      aria-expanded="false"
                      aria-haspopup="true"
                      class="icon-link d-block m-auto"
                      data-toggle="dropdown"
                      href="javascript:void(0);"
                      id="postAction"
                      title="Eylemler"
                    >
                      <i aria-hidden="true" class="fa fa-ellipsis-v px-3"></i>
                    </a>
                    <div
                      aria-labelledby="postAction"
                      class="dropdown-menu dropdown-menu-right"
                    >
                      <a class="dropdown-item" target="_blank" href="/">
                        <i
                          aria-hidden="true"
                          class="fa fa-eye fa-fw text-primary"
                        ></i>
                        Görüntüle
                      </a>
                      <!--                v-if="page_type !== 'draft'"-->
                      <!--                :disabled="drafting"-->
                      <!--                @click="moveToDraft(index)"-->
                      <a class="dropdown-item" href="javascript:void(0);">
                        <!--                    v-if="!drafting"-->
                        <span>
                          <i
                            aria-hidden="true"
                            class="fa fa-bookmark fa-fw text-primary"
                          ></i>
                          Taslaklara Taşı
                        </span>

                        <!--                    v-if="drafting"-->
                        <div
                          class="spinner-border spinner-border-sm text-primary"
                          role="status"
                        ></div>
                      </a>

                      <!--                :disabled="publishing"-->
                      <!--                @click="publish(post.id)"-->
                      <!--                  v-if="page_type !== 'published'"-->
                      <a class="dropdown-item" href="javascript:void(0);">
                        <!--                    v-if="!publishing"-->
                        <span>
                          <i
                            aria-hidden="true"
                            class="fa fa-globe-americas fa-fw text-primary"
                          ></i>
                          Yayınla
                        </span>

                        <!--                  v-if="publishing"-->
                        <div
                          class="spinner-border spinner-border-sm text-primary"
                          role="status"
                        ></div>
                      </a>

                      <!--                @click="deletingPostID = post.id"-->
                      <a
                        class="dropdown-item"
                        data-target="#confirmDeletePost"
                        data-toggle="modal"
                        href="javascript:void(0);"
                      >
                        <i
                          aria-hidden="true"
                          class="fa fa-trash fa-fw text-danger"
                        ></i>
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
                    style="background: #{post.category.color}"
                    class="border px-3 rounded"
                  >
                    {post.category.title}
                  </span>
                </td>
                <td>

                  <a title="Oyuncu Profiline Git" href="#" use:tooltip={['top', post.writer.username]}>
                    <img
                      alt="Oyuncu Adı"
                      class="rounded-circle border"
                      height="32"
                      src="https://minotar.net/avatar/e5eea5f735c444a28af9b2c867ade454/32"
                      width="32"
                    />
                  </a>
                </td>
                <td>0</td>
                <td>{getFormattedDate(post.date)}</td>
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

<!-- Confirm Delete Post Modal -->
<div
  aria-hidden="true"
  class="modal fade"
  id="confirmDeletePost"
  role="dialog"
  tabindex="-1"
>
  <div class="modal-dialog modal-dialog-centered" role="dialog">
    <div class="modal-content">
      <div class="modal-body text-center">
        <div class="pb-3">
          <i
            aria-hidden="true"
            class="fa fa-question-circle fa-4x d-block m-auto text-gray"
          ></i>
        </div>
        <!--        v-text="page_type === 'trash' ? 'Bu yazıyı kalıcı olarak silmek istediğinizden emin misiniz?' : 'Bu yazıyı çöp kutusuna taşımak istediğinizden emin misiniz?'"-->
        <span></span>
      </div>
      <div class="modal-footer">
        <button
          class="btn btn-outline-primary w-100"
          data-dismiss="modal"
          type="button"
        >
          Hayır
        </button>

        <!--        :disabled="deleting"-->
        <!--        @click="page_type === 'trash' ? deletePost() : moveToTrash()"-->
        <button class="btn btn-danger w-100" type="button">
          <!--          v-if="deleting"-->
          <div
            class="spinner-border spinner-border-sm text-white"
            role="status"
          ></div>
          <!--          v-if="!deleting"-->
          <span>Evet</span>
        </button>
      </div>
    </div>
  </div>
</div>
