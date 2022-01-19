<!-- Ticket Categories Page -->
<article class="container">
  <!-- Action Menu -->
  <div
    class="row justify-content-between align-items-center mb-3 animate__animated animate__slideInUp">
    <div class="col-auto">
      <a class="btn btn-link" role="button" href="{base}/tickets">
        <i class="fas fa-arrow-left mr-1"></i>
        Talepler
      </a>
    </div>
    <div class="col-auto">
      <button
        class="btn btn-primary"
        type="button"
        on:click="{onCreateCategoryClick}">
        <i class="fas fa-plus"></i>
        <span class="d-md-inline d-none ml-1">Kategori Oluştur</span>
      </button>
    </div>
  </div>

  <!-- Ticket Categories -->

  <div class="card">
    <div class="card-body">
      <div class="row justify-content-between pb-3 align-items-center">
        <div class="col-md-auto col-12 text-md-left text-center">
          <h5 class="card-title text-sm-left text-center">
            {data.category_count}
            Talep Kategorisi
          </h5>
        </div>
      </div>

      <!-- No Category -->
      {#if data.category_count === 0}
        <div class="container text-center animate__animated animate__zoomIn">
          <i class="fas fa-ticket-alt fa-3x text-dark text-opacity-25 m-3"></i>
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
                        href="#">
                        <i class="fas fa-ellipsis-v"></i>
                      </a>
                      <div
                        class="dropdown-menu dropdown-menu-right animate__animated animate__zoomIn">
                        <a
                          class="dropdown-item"
                          href="#"
                          on:click="{onShowDeleteTicketCategoryModalClick(
                            index
                          )}">
                          <i class="fas fa-trash text-danger mr-1"></i>
                          Sil
                        </a>
                      </div>
                    </div>
                  </th>
                  <td class="text-nowrap">
                    <a
                      href="#"
                      title="Kategoriyi Düzenle"
                      on:click="{onShowEditCategoryButtonClick(index)}">
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
        on:pageLinkClick="{(event) => reloadData(event.detail.page)}" />
    </div>
  </div>
</article>

<!-- Add / Edit Ticket Category Modal -->
<AddEditTicketCategoryModal />

<!-- Confirm Delete Ticket Category Modal -->
<ConfirmDeleteTicketCategoryModal />

<script context="module">
  import ApiUtil from "$lib/api.util";
  import { showNetworkErrorOnCatch } from "$lib/store";

  async function loadData({ page, request, CSRFToken }) {
    return new Promise((resolve, reject) => {
      ApiUtil.post({
        path: "/api/panel/initPage/tickets/categoryPage",
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
        if (body.error === "PAGE_NOT_FOUND") output = null;
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

  import AddEditTicketCategoryModal, {
    show as showTicketCategoriesAddEditModal,
    setCallback as setCallbackForTicketCategoriesAddEditModal,
    onHide as onAddEditTicketCategoryModalHide,
  } from "$lib/component/modals/AddEditTicketCategoryModal.svelte";
  import ConfirmDeleteTicketCategoryModal, {
    setCallback as setDeleteTicketCategoryModalCallback,
    show as showDeleteTicketCategoryModal,
    onHide as onConfirmDeleteTicketCategoryModalHide,
  } from "$lib/component/modals/ConfirmDeleteTicketCategoryModal.svelte";

  export let data;

  pageTitle.set("Talep Kategorileri");

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
            goto(base + "/tickets/categories/" + page);
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
