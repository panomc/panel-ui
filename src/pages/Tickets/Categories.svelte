<script>
  import { route, getPath } from "routve";

  import { isPageInitialized, showNetworkErrorOnCatch } from "../../Store";
  import ApiUtil from "../../util/api.util";
  import Pagination from "../../components/Pagination.svelte";
  import ConfirmDeleteTicketCategoryModal from "../../components/modals/ConfirmDeleteTicketCategoryModal.svelte";
  import AddEditTicketCategoryModal from "../../components/modals/AddEditTicketCategoryModal.svelte";

  import Icon from "svelte-awesome";
  import {
    faPlus,
    faArrowLeft,
    faTicketAlt,
    faEllipsisV,
    faTrash
  } from "@fortawesome/free-solid-svg-icons";

  export let page = undefined;

  let categoriesCount = 0;
  let categories = [];
  let totalPage = 1;
  let pages = [];

  function routePage(pageNumber, forceReload = false) {
    if (pageNumber !== page || forceReload) {
      showNetworkErrorOnCatch((resolve, reject) => {
        ApiUtil.post("panel/initPage/tickets/categoryPage", {
          page: pageNumber
        })
          .then(response => {
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

<!-- Action Menu -->
<div class="row justify-content-between align-items-center mb-3">
  <div class="col-6">
    <a class="btn btn-link" role="button" href="/panel/tickets">
      <Icon data="{faArrowLeft}" class="mr-1" />
      Talepler
    </a>
  </div>
  <div class="col-6 text-right">

    <!--      @click="onShowCreateCategoryButtonClick"-->
    <button
      class="btn btn-primary"
      data-target="#addEditTicketCategory"
      data-toggle="modal"
      type="button"
    >
      <Icon data="{faPlus}" />
      <span class="d-md-inline d-none ml-1">Kategori Oluştur</span>
    </button>
  </div>
</div>

<!-- Ticket Categories -->

<div class="card">
  <div class="card-body">
    <h5 class="card-title text-sm-left text-center">
      {categoriesCount} Talep Kategorisi
    </h5>

    <!-- No Category -->
    {#if categoriesCount === 0}
      <div class="container text-center">
        <Icon data="{faTicketAlt}" scale="3" class="text-glass m-3" />
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
                      <Icon data="{faEllipsisV}" />
                    </a>
                    <div
                      aria-labelledby="postAction"
                      class="dropdown-menu dropdown-menu-right"
                    >

                      <!--                  @click="onDeleteClick(category.id)"-->
                      <a
                        class="dropdown-item"
                        data-target="#confirmDeleteTicketCategory"
                        data-toggle="modal"
                        href="javascript:void(0);"
                      >
                        <Icon data="{faTrash}" class="text-danger" />
                        Sil
                      </a>
                    </div>
                  </div>
                </th>
                <td>
                  <!--              @click="onShowEditCategoryButtonClick(index)"-->
                  <a
                    data-target="#addEditTicketCategory"
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
      {page}
      {totalPage}
      on:firstPageClick="{() => routePage(1)}"
      on:lastPageClick="{() => routePage(totalPage)}"
      on:pageLinkClick="{event => routePage(event.detail.page)}"
    />
  </div>
</div>

<AddEditTicketCategoryModal />
<ConfirmDeleteTicketCategoryModal />
