<!-- Posts Page -->
<article class="container">
  <!-- Action Menu -->
  <div
    class="row justify-content-between mb-3 animate__animated animate__slideInUp"
  >
    <div class="col-auto">
      <a class="btn btn-link" role="button" href="{base}/posts">
        <i class="fas fa-arrow-left mr-1"></i>
        Yazılar
      </a>
    </div>
    <div class="col-auto">
      <a class="btn btn-primary" role="button" href="{base}/posts/create-post">
        <i class="fas fa-plus"></i>
        <span class="d-md-inline d-none ml-1">Yazı Oluştur</span>
      </a>
    </div>
  </div>

  <!-- All Posts -->

  <div class="card">
    <div class="card-body">
      <div class="row justify-content-between pb-3 align-items-center">
        <div class="col-md-auto col-12 text-md-left text-center">
          <h5 class="card-title mb-md-0">
            {data.posts_count}
            Yazı
          </h5>
        </div>
      </div>

      <!-- No Posts -->
      {#if data.posts_count === 0}
        <div class="container text-center animate__animated animate__zoomIn">
          <i class="fas fa-sticky-note fa-3x text-glass m-3"></i>
          <p class="text-gray">Burada içerik yok.</p>
        </div>
      {:else}
        <!-- Posts Table -->
        <div class="table-responsive animate__animated animate__fadeIn">
          <table class="table mb-0">
            <thead>
              <tr>
                <th scope="col"></th>
                <th class="min-w-200px align-middle" scope="col">Başlık</th>
                <th scope="col align-middle" class="table-primary">Kategori</th>
                <th scope="col align-middle">Yazar</th>
                <th scope="col align-middle">Görüntülenme</th>
                <th scope="col align-middle">Tarih</th>
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
                    onDeletePostClick(event.detail.post)}"
                />
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
        on:pageLinkClick="{(event) => reloadData(event.detail.page)}"
      />
      <!-- Pagination End -->
    </div>
  </div>
</article>

<script context="module">
  import ApiUtil from "$lib/api.util";
  import { showNetworkErrorOnCatch } from "$lib/store";

  async function loadData({ page, url, request, CSRFToken }) {
    return new Promise((resolve, reject) => {
      ApiUtil.post({
        path: "/api/panel/post/category/postsByCategory",
        body: {
          page: parseInt(page),
          url,
        },
        request,
        CSRFToken,
      }).then((body) => {
        if (body.result === "ok") {
          const data = body;

          data.page = parseInt(page);
          data.url = url;

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
  export async function load(request) {
    let output = {
      props: {
        data: {
          posts_count: 0,
          posts: [],
          total_page: 1,
          page: request.params.page || 1,
          url: request.params.url,
          category: {
            id: -1,
            title: "-",
          },
        },
      },
    };

    if (request.stuff.NETWORK_ERROR) {
      output.props.data.NETWORK_ERROR = true;

      return output;
    }

    await loadData({
      page: request.params.page || 1,
      url: request.params.url,
      request,
    })
      .then((data) => {
        output.props.data = { ...output.props.data, ...data };
      })
      .catch((body) => {
        if (body.error === "PAGE_NOT_FOUND" || body.error === "NOT_EXISTS")
          output = null;
      });

    return output;
  }
</script>

<script>
  import { goto } from "$app/navigation";
  import { page, session } from "$app/stores";
  import { base } from "$app/paths";

  import { pageTitle } from "$lib/store";

  import Pagination from "$lib/component/Pagination.svelte";

  import {
    setCallback as setDeletePostModalCallback,
    show as showDeletePostModal,
    onHide as onDeletePostModalHide,
  } from "$lib/component/modals/ConfirmDeletePostModal.svelte";
  import PostRow from "$lib/component/PostRow.svelte";

  export let data;

  pageTitle.set(
    `"${
      data.category.title === "-" ? "Kategorisiz" : data.category.title
    }" Kategorisindeki Yazılar`
  );

  if (data.NETWORK_ERROR) {
    showNetworkErrorOnCatch((resolve, reject) => {
      loadData({
        page: $page.params.page || 1,
        url: $page.params.url,
        CSRFToken: $session.CSRFToken,
      })
        .then((loadedData) => {
          data = loadedData;

          resolve();
        })
        .catch((body) => {
          if (body.error === "PAGE_NOT_FOUND" || body.error === "NOT_EXISTS") {
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
      ApiUtil.post({
        path: "/api/panel/post/moveDraft",
        body: { id },
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
      ApiUtil.post({
        path: "/api/panel/post/onlyPublish",
        body: { id },
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

  function reloadData(page = data.page, url = data.url) {
    showNetworkErrorOnCatch((resolve, reject) => {
      loadData({ page, url, CSRFToken: $session.CSRFToken })
        .then((loadedData) => {
          resolve();

          if (page !== data.page) {
            goto(base + "/posts/category/" + data.url + "/" + page);
          } else {
            data = loadedData;
          }
        })
        .catch((body) => {
          if (body.error === "PAGE_NOT_FOUND") {
            resolve();

            reloadData(page - 1);
          } else if (body.error === "NOT_EXISTS") {
            resolve();

            goto(base + "/error-404");
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
