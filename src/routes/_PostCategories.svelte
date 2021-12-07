<!-- Categories Page -->
<article class="container">
  <!-- Action Menu -->
  <div
    class="row justify-content-between align-items-center mb-3 animate__animated animate__slideInUp">
    <div class="col-6">
      <a class="btn btn-link" role="button" href="{base}/posts">
        <i class="fas fa-arrow-left mr-1"></i>
        Yazılar
      </a>
    </div>
    <div class="col-6 text-right">
      <button
        class="btn btn-primary"
        type="button"
        on:click="{onCreateCategoryClick}">
        <i class="fas fa-plus"></i>
        <span class="d-md-inline d-none ml-1">Kategori Oluştur</span>
      </button>
    </div>
  </div>

  <!-- Post categories -->
  <div class="card">
    <div class="card-body">
      <h5 class="card-title text-sm-left text-center">
        {data.category_count}
        Yazı Kategorisi
      </h5>

      <!-- No Category -->
      {#if data.category_count === 0}
        <div class="container text-center animate__animated animate__zoomIn">
          <i class="fas fa-sticky-note fa-3x text-glass m-3"></i>
          <p class="text-gray">Burada içerik yok.</p>
        </div>
      {/if}

      <!-- Tickets Table -->
      {#if data.category_count > 0}
        <div class="table-responsive animate__animated animate__fadeIn">
          <table class="table mb-0">
            <thead>
              <tr>
                <th scope="col"></th>
                <th class="min-w-200px" scope="col">Kategori</th>
                <th scope="col">Açıklama</th>
                <th scope="col">URL</th>
                <th scope="col" class="d-none">Renk</th>
              </tr>
            </thead>
            <tbody>
              {#each data.categories as category, index (category)}
                <tr class:bg-lightprimary="{category.selected}">
                  <th class="min-w-50px" scope="row">
                    <div class="dropdown position-absolute">
                      <a
                        aria-expanded="false"
                        aria-haspopup="true"
                        class="btn btn-sm py-0"
                        data-toggle="dropdown"
                        href="javascript:void(0);"
                        id="postAction"
                        title="Eylemler">
                        <i class="fas fa-ellipsis-v"></i>
                      </a>
                      <div
                        aria-labelledby="postAction"
                        class="dropdown-menu dropdown-menu-right animate__animated animate__zoomIn">
                        <a
                          class="dropdown-item"
                          href="javascript:void(0);"
                          on:click="{onShowDeletePostCategoryModalClick(
                            index
                          )}">
                          <i class="fas fa-trash text-danger mr-1"></i>
                          Sil
                        </a>
                      </div>
                    </div>
                  </th>
                  <td>
                    <a
                      data-target="#addEditCategory"
                      data-toggle="modal"
                      href="javascript:void(0);"
                      title="Kategoriyi Düzenle"
                      on:click="{onShowEditCategoryButtonClick(index)}">
                      {category.title}
                    </a>
                  </td>
                  <td>{category.description}</td>
                  <td>
                    <a
                      href="/category/{category.url}"
                      target="_blank"
                      title="Kategoriyi Görüntüle">
                      /category/
                      <b class="text-muted">{category.url}</b>
                    </a>
                  </td>
                  <td class="d-none">
                    <input
                      value="#{category.color}"
                      class="form-control form-control-sm bg-transparent"
                      disabled
                      type="color" />
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
    </div>
  </div>
</article>

<!-- Post Category Delete Confirmation Modal -->
<ConfirmDeletePostCategoryModal />

<!-- Add / Edit Post Category Modal -->
<PostCategoriesAddEditModal />

<script context="module">
  import ApiUtil from "$lib/api.util";
  import { showNetworkErrorOnCatch } from "$lib/store";

  async function loadData({ page, request, CSRFToken }) {
    return new Promise((resolve, reject) => {
      ApiUtil.post({
        path: "/api/panel/initPage/posts/categoryPage",
        body: {
          page: parseInt(page),
        },
        request,
        CSRFToken,
      }).then((body) => {
        if (body.result === "ok") {
          const data = body;

          data.page = parseInt(page);

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
          category_count: 0,
          categories: [],
          total_page: 1,
          page: 1,
        },
      },
    };

    if (request.stuff.NETWORK_ERROR) {
      output.props.data.NETWORK_ERROR = true;

      return output;
    }

    await loadData({ page: request.page.params.page || 1, request })
      .then((data) => {
        output.props.data = { ...output.props.data, ...data };
      })
      .catch((body) => {
        if (body.error === "PAGE_NOT_FOUND") {
          output = null;
        }
      });

    return output;
  }
</script>

<script>
  import { goto } from "$app/navigation";
  import { base } from "$app/paths";
  import { session, page } from "$app/stores";

  import { pageTitle } from "$lib/store";

  import Pagination from "$lib/component/Pagination.svelte";

  import PostCategoriesAddEditModal, {
    show as showPostCategoriesAddEditModal,
    setCallback as setCallbackForPostCategoriesAddEditModal,
    onHide as onAddEditPostCategoryModalHide,
  } from "$lib/component/modals/PostCategoriesAddEditModal.svelte";
  import ConfirmDeletePostCategoryModal, {
    setCallback as setDeletePostCategoryModalCallback,
    show as showDeletePostCategoryModal,
    onHide as onConfirmDeletePostCategoryModalHide,
  } from "$lib/component/modals/ConfirmDeletePostCategoryModal.svelte";

  export let data;

  pageTitle.set("Yazı Kategorileri");

  if (data.NETWORK_ERROR) {
    showNetworkErrorOnCatch((resolve, reject) => {
      loadData({ page: $page.params.page || 1, CSRFToken: $session.CSRFToken })
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

  function reloadData(page = data.page) {
    showNetworkErrorOnCatch((resolve, reject) => {
      loadData({ page, CSRFToken: $session.CSRFToken })
        .then((loadedData) => {
          if (page !== data.page) {
            goto(base + "/posts/categories/" + page);
          } else {
            data = loadedData;
          }

          resolve();
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

  function onCreateCategoryClick() {
    showPostCategoriesAddEditModal("create");
  }

  function onShowEditCategoryButtonClick(index) {
    data.categories[index].selected = true;

    showPostCategoriesAddEditModal("edit", data.categories[index]);
  }

  function onShowDeletePostCategoryModalClick(index) {
    data.categories[index].selected = true;

    showDeletePostCategoryModal(data.categories[index]);
  }

  setCallbackForPostCategoriesAddEditModal((routeFirstPage) => {
    reloadData(routeFirstPage ? 1 : data.page);
  });

  onAddEditPostCategoryModalHide((category) => {
    for (let loopCategory of data.categories) {
      if (parseInt(loopCategory.id) === parseInt(category.id)) {
        data.categories[data.categories.indexOf(loopCategory)].selected = false;

        break;
      }
    }
  });

  setDeletePostCategoryModalCallback(() => {
    reloadData(data.page);
  });

  onConfirmDeletePostCategoryModalHide((category) => {
    if (data.categories.indexOf(category) !== -1)
      data.categories[data.categories.indexOf(category)].selected = false;
  });
</script>
