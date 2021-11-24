<!-- Ticket Categories Page -->

<!-- Add / Edit Ticket Category Modal -->
<AddEditTicketCategoryModal />

<!-- Confirm Delete Ticket Category Modal -->
<ConfirmDeleteTicketCategoryModal />

<article class="container">
  <!-- Action Menu -->
  <div class="row justify-content-between align-items-center mb-3">
    <div class="col-6">
      <a class="btn btn-link" role="button" href="{base}/tickets">
        <i class="fas fa-arrow-left mr-1"></i>
        Talepler
      </a>
    </div>
    <div class="col-6 text-right">
      <button
        class="btn btn-primary"
        type="button"
        on:click="{onCreateCategoryClick}"
      >
        <i class="fas fa-plus"></i>
        <span class="d-md-inline d-none ml-1">Kategori Oluştur</span>
      </button>
    </div>
  </div>

  <!-- Ticket Categories -->

  <div class="card">
    <div class="card-body">
      <h5 class="card-title text-sm-left text-center">
        {data.category_count}
        Talep Kategorisi
      </h5>

      <!-- No Category -->
      {#if data.category_count === 0}
        <div class="container text-center">
          <i class="fas fa-ticket-alt fa-3x text-glass m-3"></i>
          <p class="text-gray">Burada içerik yok.</p>
        </div>
      {/if}

      <!-- Tickets Table -->
      {#if data.category_count > 0}
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
              {#each data.categories as category, index (category)}
                <tr class:bg-lightprimary="{category.selected}">
                  <th scope="row">
                    <div class="dropdown">
                      <a
                        class="btn btn-sm py-0"
                        aria-expanded="false"
                        aria-haspopup="true"
                        data-toggle="dropdown"
                        href="javascript:void(0);"
                        id="postAction"
                      >
                        <i class="fas fa-ellipsis-v"></i>
                      </a>
                      <div
                        aria-labelledby="postAction"
                        class="dropdown-menu dropdown-menu-right"
                      >
                        <a
                          class="dropdown-item"
                          href="javascript:void(0);"
                          on:click="{onShowDeleteTicketCategoryModalClick(
                            index
                          )}"
                        >
                          <i class="fas fa-trash text-danger mr-1"></i>
                          Sil
                        </a>
                      </div>
                    </div>
                  </th>
                  <td class="text-nowrap">
                    <a
                      href="javascript:void(0);"
                      title="Kategoriyi Düzenle"
                      on:click="{onShowEditCategoryButtonClick(index)}"
                    >
                      {category.title}
                    </a>
                  </td>
                  <td class="text-nowrap">{category.description}</td>
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
        on:pageLinkClick="{(event) => reloadData(event.detail.page)}"
      />
    </div>
  </div>
</article>

<script context="module">
  import { browser } from "$app/env";

  import ApiUtil from "$lib/api.util";
  import { showNetworkErrorOnCatch } from "$lib/store";

  let refreshable = false;

  async function loadData(page) {
    return new Promise((resolve, reject) => {
      ApiUtil.post("panel/initPage/tickets/categoryPage", {
        page: parseInt(page),
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

  async function initData(page) {
    return new Promise((resolvePromise, rejectPromise) => {
      showNetworkErrorOnCatch((resolve, reject) => {
        loadData(page)
          .then((data) => {
            data.page = parseInt(page);

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
  export async function load({ page, session }) {
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

    if (
      page.path === session.loadedPath &&
      !refreshable &&
      !!session.data &&
      session.data.error === "PAGE_NOT_FOUND"
    )
      return null;

    if (browser && (page.path !== session.loadedPath || refreshable)) {
      // from another page
      await initData(!!page.params.page ? parseInt(page.params.page) : 1)
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
    }

    return output;
  }
</script>

<script>
  import { goto } from "$app/navigation";
  import { base } from "$app/paths";

  import Pagination from "../components/Pagination.svelte";

  import AddEditTicketCategoryModal, {
    show as showTicketCategoriesAddEditModal,
    setCallback as setCallbackForTicketCategoriesAddEditModal,
    onHide as onAddEditTicketCategoryModalHide,
  } from "../components/modals/AddEditTicketCategoryModal.svelte";
  import ConfirmDeleteTicketCategoryModal, {
    setCallback as setDeleteTicketCategoryModalCallback,
    show as showDeleteTicketCategoryModal,
    onHide as onConfirmDeleteTicketCategoryModalHide,
  } from "../components/modals/ConfirmDeleteTicketCategoryModal.svelte";

  export let data;

  function reloadData(page = data.page) {
    showNetworkErrorOnCatch((resolve, reject) => {
      loadData(page)
        .then((loadedData) => {
          resolve();

          if (page !== data.page) {
            goto(base + "/tickets/categories/" + page);
          } else {
            data = loadedData;
            data.page = page;
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

  function onCreateCategoryClick() {
    showTicketCategoriesAddEditModal("create");
  }

  function onShowEditCategoryButtonClick(index) {
    data.categories[index].selected = true;

    showTicketCategoriesAddEditModal("edit", data.categories[index]);
  }

  function onShowDeleteTicketCategoryModalClick(index) {
    data.categories[index].selected = true;

    showDeleteTicketCategoryModal(data.categories[index]);
  }

  setCallbackForTicketCategoriesAddEditModal((routeFirstPage) => {
    reloadData(routeFirstPage ? 1 : data.page);
  });

  onAddEditTicketCategoryModalHide((category) => {
    if (data.categories.indexOf(category) !== -1)
      data.categories[data.categories.indexOf(category)].selected = false;
  });

  setDeleteTicketCategoryModalCallback(() => {
    reloadData(data.page);
  });

  onConfirmDeleteTicketCategoryModalHide((category) => {
    if (data.categories.indexOf(category) !== -1)
      data.categories[data.categories.indexOf(category)].selected = false;
  });
</script>
