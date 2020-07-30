<script>
  import { isPageInitialized } from "../../Store";

  isPageInitialized.set(true);
</script>


<!-- Categories Page -->
<div>
  <!-- Action Menu -->
  <div class="row justify-content-between align-items-center mb-3">
    <div class="col-6">
      <a
              class="btn btn-outline-primary"
              role="button"
              href="/panel/posts/"
      >
        <i aria-hidden="true" class="fa fa-arrow-left fa-fw"></i>
        Tüm Yazılar
      </a>
    </div>
    <div class="col-6 text-right">
      <!--              @click="onShowCreateCategoryButtonClick"-->
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

  <!-- Post categories -->
  <div class="card">
    <div class="card-body">
      <h5 class="card-title text-sm-left text-center">
<!--        {{ category_count }} -->
        Kategori -
        <span class="text-primary">
<!--          {{ page }}-->
          /
<!--          {{ total_page }}-->
        </span>
      </h5>

      <!-- No Category -->
<!--      v-if="category_count === 0"-->
      <div class="container text-center">
        <i aria-hidden="true" class="far fa-list-alt fa-4x text-glass m-3"></i>
        <p class="text-gray">Burada gösterilecek içerik yok.</p>
      </div>

      <!-- Tickets Table -->
<!--      v-if="category_count > 0"-->
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
<!--          :key="index" v-for="(category, index) in categories"-->
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
                  <!--                          @click="onDeleteClick(category.id)"-->
                  <a
                          class="dropdown-item"
                          data-target="#confirmDeleteCategory"
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
<!--              @click="onShowEditCategoryButtonClick(index)"-->
              <a
                      data-target="#addEditCategory"
                      data-toggle="modal"
                      href="javascript:void(0);"
                      title="Kategoriyi Düzenle"
              >
<!--                {{ category.title }}-->
              </a>
            </td>
            <td>
<!--              {{ category.description }}-->
            </td>
            <td>

<!--              :href="'/category/' + category.url"-->
              <a
                      target="_blank"
                      title="Kategoriyi Görüntüle"
              >
<!--                {{ host }}-->
                /category/
                <b class="text-muted">
<!--                  {{ category.url }}-->
                </b>
              </a>
            </td>
            <td>
              <!--                      :value="'#' + category.color"-->
              <input
                      class="form-control form-control-sm"
                      disabled
                      type="color"
              />
            </td>
          </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <nav class="pt-3">
        <ul class="pagination pagination-sm mb-0 justify-content-start">
          <!--                  :class="{ 'disabled': page === 1 }"-->
          <!--                  @click="routePage(1)"-->
          <li
                  class="page-item"
          >
            <a
                    class="page-link"
                    href="javascript:void(0);"
                    title="Önceki Sayfa"
            >
              <span aria-hidden="true">&laquo;</span>
            </a>
          </li>
          <!--                  :class="{ 'active': index === page }"-->
          <!--                  :key="index"-->
          <!--                  @click="routePage(index)"-->
          <!--                  v-for="index in total_page"-->
          <li
                  class="page-item"
          >
            <!--                    v-if="page !== index"-->
            <a
                    class="page-link"
                    href="javascript:void(0);"
            >
<!--              {{index}}-->
            </a>
            <a class="page-link" v-if="page === index">
<!--              {{index}}-->
            </a>
          </li>
          <!--                  :class="{ 'disabled': page === total_page }"-->
          <!--                  @click="routePage(total_page)"-->
          <li
                  class="page-item"
          >
            <a
                    class="page-link"
                    href="javascript:void(0);"
                    title="Sonraki Sayfa"
            >
              <span aria-hidden="true">&raquo;</span>
            </a>
          </li>
        </ul>
      </nav>
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
          <!--                  v-text="showEditCategory ? 'Kategori Düzenle' : 'Kategori Oluştur'"-->
          <h5
                  class="modal-title"
          ></h5>

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
              <!--                      :class="{ 'border-danger': categoryForm.error.name }"-->
              <!--                      v-model="categoryForm.name"-->
              <input
                      class="form-control"
                      id="category"
                      type="text"
              />
            </div>
            <div class="form-group">
              <label for="categoryDescription">Açıklama:</label>
              <!--                      :class="{ 'border-danger': categoryForm.error.description }"-->
<!--              v-model="categoryForm.description"-->
              <input
                      class="form-control"
                      id="categoryDescription"
                      type="text"
              />
            </div>
            <div class="form-group">
              <label for="categoryURL">URL:</label>
              <div class="input-group ">
                <div class="input-group-prepend">
                  <span class="input-group-text">
<!--                    {{ host }}-->
                    /category/</span>
                </div>
                <!--                        :class="{ 'border-danger': categoryForm.error.url }"-->
                <!--                        v-model="categoryForm.url"-->
                <input
                        class="form-control"
                        id="categoryURL"
                        type="text"
                />
              </div>
<!--              :class="{ 'text-danger': categoryForm.error.url }"-->
              <small>
                <i
                        aria-hidden="true"
                        class="fa fa-exclamation-circle fa-fw"
                ></i>
                Yanlızca [A-Z/a-z/0-9/_] içerebilir ve minimum 3, maksimum 32
                karkater olabilir.
              </small>
            </div>
            <div class="form-group">
              <label for="categoryColor">Renk:</label>
              <div class="input-group">
                <!--                        v-model="categoryForm.colorCode"-->
                <input
                        class="form-control"
                        id="categoryColor"
                        type="color"
                />
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <!--                    :class="{ 'btn-secondary': !showEditCategory, 'btn-primary': showEditCategory }"-->
            <!--                    :disabled="isSaveAddButtonDisabled || addingOrSaving"-->
            <button
                    class="btn btn-block"
                    type="submit"
            >
              <!--                      v-if="addingOrSaving"-->
              <div
                      class="spinner-border spinner-border-sm text-white"
                      role="status"
              ></div>
<!--              v-if="showEditCategory && !addingOrSaving"-->
              <span>
                <i aria-hidden="true" class="fa fa-save fa-fw"></i>
                Kaydet
              </span>
<!--              v-if="!showEditCategory && !addingOrSaving"-->
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
          <!--                  :disabled="deleting"-->
          <!--                  @click="deleteCategory"-->
          <button
                  class="btn btn-danger w-100"
                  type="button"
          >
            <!--                    v-if="deleting"-->
            <div
                    class="spinner-border spinner-border-sm text-white"
                    role="status"
            ></div>
<!--            v-if="!deleting"-->
            <span>
              Evet
            </span>
          </button>
        </div>
      </div>
    </div>
  </div>
</div>
