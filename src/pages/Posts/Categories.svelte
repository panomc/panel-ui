<script>
  import { route, getPath } from "routve";

  import { isPageInitialized, showNetworkErrorOnCatch } from "../../Store";
  import ApiUtil from "../../pano/js/api.util";
  import Pagination from "../../components/Pagination.svelte";
  import PostCategoriesAddEditModal, {
    show as showPostCategoriesAddEditModal,
    setCallback as setCallbackForPostCategoriesAddEditModal,
  } from "../../components/modals/PostCategoriesAddEditModal.svelte";

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

  function routePage(pageNumber, forceReload = false) {
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

              isPageInitialized.set(true);

              if (errorCode === "PAGE_NOT_FOUND") {
                route("/panel/error-404");
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
    showPostCategoriesAddEditModal("edit", categories[index]);
  }

  setCallbackForPostCategoriesAddEditModal((routeFirstPage) => {
    routePage(
      routeFirstPage ? 1 : typeof page === "undefined" ? 1 : parseInt(page),
      true
    );
  });

  routePage(typeof page === "undefined" ? 1 : parseInt(page));
</script>

<!-- Add / Edit Category Modal -->
<PostCategoriesAddEditModal />

<!-- Categories Page -->
<div>
  <!-- Action Menu -->
  <div class="row justify-content-between align-items-center mb-3">
    <div class="col-6">
      <a class="btn btn-link" role="button" href="/panel/posts">
        <Icon data="{faArrowLeft}" class="mr-1" />
        Yazılar
      </a>
    </div>
    <div class="col-6 text-right">
      <!--              @click="onShowCreateCategoryButtonClick"-->
      <button
        class="btn btn-primary"
        type="button"
        on:click="{onCreateCategoryClick}"
      >
        <Icon data="{faPlus}" />
        <span class="d-md-inline d-none ml-1">Kategori Oluştur</span>
      </button>
    </div>
  </div>

  <!-- Post categories -->
  <div class="card">
    <div class="card-body">
      <h5 class="card-title text-sm-left text-center">
        {categoriesCount} Yazı Kategorisi
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
                <th scope="col">Renk</th>
              </tr>
            </thead>
            <tbody>
              {#each categories as category, index (category)}
                <tr>
                  <th class="min-w-50px" scope="row">
                    <div class="dropdown position-absolute">
                      <a
                        aria-expanded="false"
                        aria-haspopup="true"
                        class="btn btn-sm py-0"
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
                        <!--                          @click="onDeleteClick(category.id)"-->
                        <a
                          class="dropdown-item"
                          data-target="#confirmDeleteCategory"
                          data-toggle="modal"
                          href="javascript:void(0);"
                        >
                          <Icon data="{faTrash}" class="text-danger mr-1" />
                          Sil
                        </a>
                      </div>
                    </div>
                  </th>
                  <td>
                    <!--              @click="onShowEditCategoryButtonClick(index)"-->
                    <a
                      data-target="#addEditCategory"
                      data-toggle="modal"
                      href="javascript:void(0);"
                      title="Kategoriyi Düzenle"
                      on:click="{onShowEditCategoryButtonClick(index)}"
                    >
                      {category.title}
                    </a>
                  </td>
                  <td>{category.description}</td>
                  <td>
                    <a
                      href="/category/{category.url}"
                      target="_blank"
                      title="Kategoriyi Görüntüle"
                    >
                      /category/
                      <b class="text-muted">{category.url}</b>
                    </a>
                  </td>
                  <td>
                    <input
                      value="#{category.color}"
                      class="form-control form-control-sm"
                      disabled
                      type="color"
                    />
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

  <!-- Confirm Delete Category Modal -->
  <div
    aria-hidden="true"
    class="modal fade"
    id="confirmDeleteCategory"
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
          Bu kategoriyi kalıcı olarak silmek istediğinizden emin misiniz?
          <br />
          <br />
          <span class="text-danger">
            <i aria-hidden="true" class="fa fa-exclamation-circle fa-fw"></i>
            İçerisindeki 12 yazı kategorisiz kalacak:
          </span>
          <br />
          <ul class="list-unstyled">
            <li>Yazı 1</li>
            <li>Yazı 2</li>
            <li>Yazı 3</li>
            <li>Yazı 4</li>
          </ul>
          <a href="#">Daha Fazlasını Göster</a>
        </div>
        <div class="modal-footer">
          <button
            class="btn btn-outline-primary w-100"
            data-dismiss="modal"
            type="button"
          >
            Hayır
          </button>
          <!--                  :disabled="deleting"-->
          <!--                  @click="deleteCategory"-->
          <button class="btn btn-danger w-100" type="button">
            <!--                    v-if="deleting"-->
            <div
              class="spinner-border spinner-border-sm text-white"
              role="status"
            ></div>
            <!--            v-if="!deleting"-->
            <span>Evet</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</div>
