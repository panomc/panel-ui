<!-- Categories Page -->
<article class="container">
  <!-- Action Menu -->
  <div
    class="row justify-content-between align-items-center mb-3 animate__animated animate__slideInUp">
    <div class="col-auto">
      <a class="btn btn-link" role="button" href="{base}/posts">
        <i class="fas fa-arrow-left me-2"></i>
        Yazılar
      </a>
    </div>
    <div class="col-auto">
      <button
        class="btn btn-secondary"
        type="button"
        on:click="{onCreateCategoryClick}">
        <i class="fas fa-plus me-2"></i>Kategori Oluştur
      </button>
    </div>
  </div>

  <!-- Post categories -->
  <div class="card">
    <div class="card-body">
      <div class="row justify-content-between pb-3 align-items-center">
        <div class="col-md-auto col-12 text-md-left text-center">
          <h5 class="card-title">
            {data.categoryCount}
            Yazı Kategorisi
          </h5>
        </div>
      </div>
      <!-- No Category -->
      {#if data.categoryCount === 0}
        <div class="container text-center animate__animated animate__zoomIn">
          <i class="fa-solid fa-pem fa-3x text-dark text-opacity-25 m-3"></i>
          <p class="text-gray">Burada içerik yok.</p>
        </div>
      {/if}

      <!-- Tickets Table -->
      {#if data.categoryCount > 0}
        <div class="table-responsive">
          <table class="table table-borderless table-hover mb-0">
            <thead>
              <tr>
                <th scope="col"></th>
                <th class="align-middle" scope="col">Kategori</th>
                <th scope="col" class="align-middle">Açıklama</th>
                <th scope="col" class="align-middle">URL</th>
                <th scope="col" class="d-none align-middle">Renk</th>
              </tr>
            </thead>
            <tbody>
              {#each data.categories as category, index (category)}
                <tr class:table-primary="{category.selected}">
                  <th scope="row" class="align-middle">
                    <a
                      title="Sil"
                      class="btn btn-sm btn-link link-danger"
                      href="javascript:void(0);"
                      on:click="{onShowDeletePostCategoryModalClick(index)}">
                      <i class="fas fa-trash"></i>
                    </a>
                  </th>
                  <td class="align-middle text-nowrap">
                    <a
                      data-bs-target="#addEditCategory"
                      data-bs-toggle="modal"
                      href="javascript:void(0);"
                      title="Düzenle"
                      on:click="{onShowEditCategoryButtonClick(index)}">
                      {category.title}
                    </a>
                  </td>
                  <td class="align-middle text-nowrap"
                    >{category.description}</td>
                  <td class="align-middle">
                    <a
                      href="/category/{category.url}"
                      target="_blank"
                      title="Görüntüle">
                      /category/{category.url}
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
        totalPage="{data.totalPage}"
        on:firstPageClick="{() => reloadData(1)}"
        on:lastPageClick="{() => reloadData(data.totalPage)}"
        on:pageLinkClick="{(event) => reloadData(event.detail.page)}" />
    </div>
  </div>
</article>

<!-- Post Category Delete Confirmation Modal -->
<ConfirmDeletePostCategoryModal />

<!-- Add / Edit Post Category Modal -->
<AddEditPostCategoryModal />

<script context="module">
  import ApiUtil from "$lib/api.util";
  import { showNetworkErrorOnCatch } from "$lib/Store";
  import { error } from "@sveltejs/kit";

  async function loadData({ page, request }) {
    return new Promise((resolve, reject) => {
      ApiUtil.get({
        path: `/api/panel/post/categories?page=${page}`,
        request
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
   * @type {import('@sveltejs/kit').PageLoad}
   */
  export async function load(event) {
    const { parent } = event;
    await parent();

    let data = {
      categoryCount: 0,
      categories: [],
      totalPage: 1,
      page: 1,
    };

    // if (event.stuff.NETWORK_ERROR) {
    //   output.props.data.NETWORK_ERROR = true;
    //
    //   return output;
    // }

    await loadData({ page: event.params.page || 1, request: event })
      .then((body) => {
        data = { ...data, ...body };
      })
      .catch((body) => {
        if (body.error) {
          if (body.error === "NOT_EXISTS" || body.error === "PAGE_NOT_FOUND") {
            throw error(404, body.error);
          }

          throw error(500, body.error);
        }
      });

    return data;
  }
</script>

<script>
  import { goto } from "$app/navigation";
  import { base } from "$app/paths";
  import { page } from "$app/stores";

  import { pageTitle } from "$lib/Store";

  import Pagination from "$lib/component/Pagination.svelte";

  import AddEditPostCategoryModal, {
    show as showAddEditPostCategoryModal,
    setCallback as setCallbackForAddEditPostCategoryModal,
    onHide as onAddEditPostCategoryModalHide,
  } from "$lib/component/modals/AddEditPostCategoryModal.svelte";
  import ConfirmDeletePostCategoryModal, {
    setCallback as setDeletePostCategoryModalCallback,
    show as showDeletePostCategoryModal,
    onHide as onConfirmDeletePostCategoryModalHide,
  } from "$lib/component/modals/ConfirmDeletePostCategoryModal.svelte";

  export let data;

  pageTitle.set("Yazı Kategorileri");

  if (data.NETWORK_ERROR) {
    showNetworkErrorOnCatch((resolve, reject) => {
      loadData({ page: $page.params.page || 1 })
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
      loadData({ page })
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
    showAddEditPostCategoryModal("create");
  }

  function onShowEditCategoryButtonClick(index) {
    data.categories[index].selected = true;

    showAddEditPostCategoryModal("edit", data.categories[index]);
  }

  function onShowDeletePostCategoryModalClick(index) {
    data.categories[index].selected = true;

    showDeletePostCategoryModal(data.categories[index]);
  }

  setCallbackForAddEditPostCategoryModal((routeFirstPage) => {
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
