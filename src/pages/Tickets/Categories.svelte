<script>
  import { route, getPath } from "routve";

  import { isPageInitialized, showNetworkErrorOnCatch } from "../../Store";
  import ApiUtil from "../../util/api.util";
  import Pagination from "../../components/Pagination.svelte";

  export let page = undefined;

  let categoriesCount = 0;
  let categories = [];
  let totalPage = 1;
  let pages = [];

  function routePage(pageNumber, forceReload = false) {
    if (pageNumber !== page || forceReload) {
      showNetworkErrorOnCatch((resolve, reject) => {
        ApiUtil.post("panel/initPage/tickets/categoryPage", {
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
                getPath() !== "/panel/tickets/categories" &&
                getPath() !== "/panel/tickets/categories/"
              )
                route("/panel/tickets/categories/" + page);
              else if (page !== 1) route("/panel/tickets/categories/" + page);

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

  routePage(typeof page === "undefined" ? 1 : parseInt(page));
</script>

<!-- Ticket Categories Page -->

<div>
  <!-- Action Menu -->
  <div class="row justify-content-between align-items-center mb-3">
    <div class="col-6">
      <a class="btn btn-outline-primary" role="button" href="/panel/tickets">
        <i aria-hidden="true" class="fa fa-arrow-left fa-fw"></i>
        Tüm Talepler
      </a>
    </div>
    <div class="col-6 text-right">

      <!--      @click="onShowCreateCategoryButtonClick"-->
      <button
        class="btn btn-primary"
        data-target="#addEditCategory"
        data-toggle="modal"
        type="button"
      >
        <i aria-hidden="true" class="fa fa-plus fa-fw"></i>
        <span class="d-md-inline d-none">Kategori Oluştur</span>
      </button>
    </div>
  </div>

  <!-- Ticket Categories -->

  <div class="card">
    <div class="card-body">
      <h5 class="card-title text-sm-left text-center">
        {categoriesCount} Kategori -
        <span class="text-primary">{page} / {totalPage}</span>
      </h5>

      <!-- No Category -->
      {#if categoriesCount === 0}
        <div class="container text-center">
          <!--          TODO: icon to component-->
          <i
            aria-hidden="true"
            class="far fa-list-alt fa-4x text-glass m-3"
          ></i>
          <p class="text-gray">Burada gösterilecek içerik yok.</p>
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
              </tr>
            </thead>
            <tbody>
              {#each categories as category, index (category)}
                <tr>
                  <th class="min-w-50px" scope="row">
                    <div class="dropdown">
                      <a
                        aria-expanded="false"
                        aria-haspopup="true"
                        class="icon-link d-blcok m-auto"
                        data-toggle="dropdown"
                        href="javascript:void(0);"
                        id="postAction"
                      >
                        <!--          TODO: icon to component-->
                        <i aria-hidden="true" class="fa fa-ellipsis-v px-3"></i>
                      </a>
                      <div
                        aria-labelledby="postAction"
                        class="dropdown-menu dropdown-menu-right"
                      >

                        <!--                  @click="onDeleteClick(category.id)"-->
                        <a
                          class="dropdown-item"
                          data-target="#confirmDeleteCategory"
                          data-toggle="modal"
                          href="javascript:void(0);"
                        >
                          <!--          TODO: icon to component-->
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
                    <!--              @click="onShowEditCategoryButtonClick(index)"-->
                    <a
                      data-target="#addEditCategory"
                      data-toggle="modal"
                      href="javascript:void(0);"
                      title="Kategoriyi Düzenle"
                    >
                      {category.title}
                    </a>
                  </td>
                  <td>{category.description}</td>
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
        on:onPageLinkClick="{(event) => routePage(event.detail.page)}"
      />
    </div>
  </div>

  <!-- Add / Edit Category Modal -->
  <div
    aria-hidden="true"
    class="modal fade"
    id="addEditCategory"
    role="dialog"
    tabindex="-1"
  >
    <div class="modal-dialog modal-dialog-centered" role="dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Kategori Ekle</h5>

          <button
            aria-label="Kapat"
            class="close"
            data-dismiss="modal"
            title="Pencereyi Kapat"
            type="button"
          >
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <!--        @submit.prevent="submitSaveOrAdd"-->
        <form>
          <div class="modal-body">
            <div class="form-group">
              <label for="category">Kategori:</label>
              <!--              :class="{ 'border-danger': categoryForm.error.name }"-->
              <!--              v-model="categoryForm.name"-->
              <input class="form-control" id="category" type="text" />
            </div>
            <div class="form-group">
              <label for="categoryDescription">Açıklama:</label>
              <!--              :class="{ 'border-danger': categoryForm.error.description }"-->
              <!--              v-model="categoryForm.description"-->
              <input
                class="form-control"
                id="categoryDescription"
                type="text"
              />
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn btn-block btn-secondary" type="submit">
              <span>
                <i aria-hidden="true" class="fa fa-plus fa-fw"></i>
                Oluştur
              </span>
            </button>
          </div>
        </form>
      </div>
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

          <!--          :disabled="deleting"-->
          <!--          @click="deleteCategory"-->
          <button class="btn btn-danger w-100" type="button">
            <div
              class="spinner-border spinner-border-sm text-white"
              role="status"
              v-if="deleting"
            ></div>

            <span v-if="!deleting">Evet</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</div>
