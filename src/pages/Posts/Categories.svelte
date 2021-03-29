<script>
  import { route, getPath } from "routve";

  import { isPageInitialized, showNetworkErrorOnCatch } from "../../Store";
  import ApiUtil from "../../pano-ui/js/api.util";
  import Pagination from "../../components/Pagination.svelte";

  import PostCategoriesAddEditModal, {
    show as showPostCategoriesAddEditModal,
    setCallback as setCallbackForPostCategoriesAddEditModal,
    onHide as onAddEditPostCategoryModalHide,
  } from "../../components/modals/PostCategoriesAddEditModal.svelte";
  import ConfirmDeletePostCategoryModal, {
    setCallback as setDeletePostCategoryModalCallback,
    show as showDeletePostCategoryModal,
    onHide as onConfirmDeletePostCategoryModalHide,
  } from "../../components/modals/ConfirmDeletePostCategoryModal.svelte";

  import Icon from "svelte-awesome";
  import {
    faPlus,
    faArrowLeft,
    faStickyNote,
    faTrash,
    faEllipsisV,
  } from "@fortawesome/free-solid-svg-icons";

  export let page = undefined;

  let categoriesCount = 0;
  let categories = [];
  let totalPage = 1;
  let pages = [];

  function routePage(pageNumber, forceReload = false, findLastPage = false) {
    if (pageNumber !== page || forceReload) {
      showNetworkErrorOnCatch((resolve, reject) => {
        ApiUtil.post("panel/initPage/posts/categoryPage", {
          page: pageNumber,
        })
          .then((response) => {
            if (response.data.result === "ok") {
              categoriesCount = response.data.category_count;
              categories = response.data.categories;
              totalPage = response.data.total_page;

              page = pageNumber;

              isPageInitialized.set(true);

              if (
                page === 1 &&
                getPath() !== "/panel/posts/categories" &&
                getPath() !== "/panel/posts/categories/"
              )
                route("/panel/posts/categories/" + page);
              else if (page !== 1) route("/panel/posts/categories/" + page);

              resolve();
            } else if (response.data.result === "error") {
              const errorCode = response.data.error;

              if (!findLastPage) {
                isPageInitialized.set(true);
              }

              if (errorCode === "PAGE_NOT_FOUND") {
                if (findLastPage) {
                  routePage(page - 1, true, true);
                } else route("/panel/error-404");
              }

              resolve();
            } else reject();
          })
          .catch(() => {
            reject();
          });
      });
    }
  }

  function onCreateCategoryClick() {
    showPostCategoriesAddEditModal("create");
  }

  function onShowEditCategoryButtonClick(index) {
    categories[index].selected = true;

    showPostCategoriesAddEditModal("edit", categories[index]);
  }

  function onShowDeletePostCategoryModalClick(index) {
    categories[index].selected = true;

    showDeletePostCategoryModal(categories[index]);
  }

  setCallbackForPostCategoriesAddEditModal((routeFirstPage) => {
    routePage(
      routeFirstPage ? 1 : typeof page === "undefined" ? 1 : parseInt(page),
      true,
      page !== 1
    );
  });

  onAddEditPostCategoryModalHide((category) => {
    for (let loopCategory of categories) {
      if (parseInt(loopCategory.id) === parseInt(category.id)) {
        categories[categories.indexOf(loopCategory)].selected = false;

        break;
      }
    }
  });

  setDeletePostCategoryModalCallback((routeFirstPage) => {
    routePage(
      routeFirstPage ? 1 : typeof page === "undefined" ? 1 : parseInt(page),
      true,
      page !== 1
    );
  });

  onConfirmDeletePostCategoryModalHide((category) => {
    if (categories.indexOf(category) !== -1)
      categories[categories.indexOf(category)].selected = false;
  });

  routePage(typeof page === "undefined" ? 1 : parseInt(page));
</script>

<!-- Categories Page -->

<!-- Action Menu -->
<div class="row justify-content-between align-items-center mb-3">
  <div class="col-6">
    <a class="btn btn-link" role="button" href="/panel/posts">
      <Icon data="{faArrowLeft}" class="mr-1" />
      Yazılar
    </a>
  </div>
  <div class="col-6 text-right">
    <button
      class="btn btn-primary"
      type="button"
      on:click="{onCreateCategoryClick}">
      <Icon data="{faPlus}" />
      <span class="d-md-inline d-none ml-1">Kategori Oluştur</span>
    </button>
  </div>
</div>

<!-- Post categories -->
<div class="card">
  <div class="card-body">
    <h5 class="card-title text-sm-left text-center">
      {categoriesCount}
      Yazı Kategorisi
    </h5>

    <!-- No Category -->
    {#if categoriesCount === 0}
      <div class="container text-center">
        <Icon data="{faStickyNote}" scale="3" class="text-glass m-3" />
        <p class="text-gray">Burada içerik yok.</p>
      </div>
    {/if}

    <!-- Tickets Table -->
    {#if categoriesCount > 0}
      <div class="table-responsive">
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
            {#each categories as category, index (category)}
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
                      <Icon data="{faEllipsisV}" />
                    </a>
                    <div
                      aria-labelledby="postAction"
                      class="dropdown-menu dropdown-menu-right">
                      <a
                        class="dropdown-item"
                        href="javascript:void(0);"
                        on:click="{onShowDeletePostCategoryModalClick(index)}">
                        <Icon data="{faTrash}" class="text-danger mr-1" />
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
      page="{page}"
      totalPage="{totalPage}"
      on:firstPageClick="{() => routePage(1)}"
      on:lastPageClick="{() => routePage(totalPage)}"
      on:pageLinkClick="{(event) => routePage(event.detail.page)}" />
  </div>
</div>

<!-- Post Category Delete Confirmation Modal -->
<ConfirmDeletePostCategoryModal />

<!-- Add / Edit Post Category Modal -->
<PostCategoriesAddEditModal />
