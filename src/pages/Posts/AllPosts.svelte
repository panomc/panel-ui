<script>
  import { isPageInitialized } from "../../Store";

  isPageInitialized.set(true);
</script>

<!-- Action Menu -->
<div class="row mb-3">
  <div class="col-md-4 col-6">
    <router-link
      class="btn btn-link"
      role="button"
      to="/panel/posts/categories"
    >
      <i aria-hidden="true" class="far fa-list-alt fa-fw"></i>
      <span class="d-md-inline d-none">Kategoriler</span>
    </router-link>
  </div>
  <div class="col text-right">
    <router-link
      class="btn btn-primary"
      role="button"
      to="/panel/posts/create-post"
    >
      <i aria-hidden="true" class="fa fa-plus fa-fw"></i>
      <span class="d-md-inline d-none">Yazı Oluştur</span>
    </router-link>
  </div>
</div>

<!-- All Posts -->

<div class="card">
  <div class="card-body">
    <div class="row justify-content-between">
      <div class="col-md-6 col-12 text-md-left text-center">
        <h5 class="card-title">
          <!--            {{ posts_count }} -->
          Yazı -
          <!--          {{ page }}/{{ total_page }}-->
          <span class="text-primary"></span>
        </h5>
      </div>
      <div class="col-md-6 col-12 text-md-right text-center">
        <div class="btn-group">

          <!--          :class="{ 'active': page_type === 'published' }"-->
          <router-link
            class="btn btn-sm btn-outline-light btn-link"
            role="button"
            to="/panel/posts/published"
          >
            Yayınlanmış
          </router-link>
          <!--          :class="{ 'active': page_type === 'draft' }"-->
          <router-link
            class="btn btn-sm btn-outline-light btn-link"
            role="button"
            to="/panel/posts/draft"
          >
            Taslak
          </router-link>

          <!--          :class="{ 'active': page_type === 'trash' }"-->
          <router-link
            class="btn btn-sm btn-outline-light btn-link text-danger"
            role="button"
            to="/panel/posts/trash"
          >
            Çöp
          </router-link>
        </div>
      </div>
    </div>

    <!-- No Posts -->
    <!--    v-if="posts_count === 0"-->
    <div class="container text-center">
      <i aria-hidden="true" class="far fa-sticky-note fa-4x text-glass m-3"></i>
      <p class="text-gray">Burada içerik yok.</p>
    </div>

    <!-- Posts Table -->
    <!--    v-if="posts_count !== 0"-->
    <div class="table-responsive">
      <table class="table mb-0">
        <thead>
          <tr>
            <th scope="col"></th>
            <th class="min-w-200px" scope="col">Başlık</th>
            <th scope="col">Kategori</th>
            <th scope="col">Yazar</th>
            <th scope="col">Görüntülenme</th>
            <th scope="col">Tarih</th>
          </tr>
        </thead>
        <tbody>
          <!--        :key="index" v-for="(post, index) in posts"-->
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
                  <router-link class="dropdown-item" target="_blank" to="/">
                    <i
                      aria-hidden="true"
                      class="fa fa-eye fa-fw text-primary"
                    ></i>
                    Görüntüle
                  </router-link>
                  <!--                v-if="page_type !== 'draft'"-->
                  <!--                :disabled="drafting"-->
                  <!--                @click="moveToDraft(index)"-->
                  <a class="dropdown-item" href="javascript:void(0);">
<!--                    v-if="!drafting"-->
                    <span>
                      <i
                        aria-hidden="true"
                        class="fa fa-bookmark fa-fw text-primary"
                      ></i>
                      Taslaklara Taşı
                    </span>

<!--                    v-if="drafting"-->
                    <div
                      class="spinner-border spinner-border-sm text-primary"
                      role="status"
                    ></div>
                  </a>

                  <!--                :disabled="publishing"-->
                  <!--                @click="publish(post.id)"-->
<!--                  v-if="page_type !== 'published'"-->
                  <a
                    class="dropdown-item"
                    href="javascript:void(0);"
                  >
<!--                    v-if="!publishing"-->
                    <span>
                      <i
                        aria-hidden="true"
                        class="fa fa-globe-americas fa-fw text-primary"
                      ></i>
                      Yayınla
                    </span>

                    <!--                  v-if="publishing"-->
                    <div
                      class="spinner-border spinner-border-sm text-primary"
                      role="status"
                    ></div>
                  </a>

                  <!--                @click="deletingPostID = post.id"-->
                  <a
                    class="dropdown-item"
                    data-target="#confirmDeletePost"
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
              <router-link
                :to="'/panel/posts/post/' + post.id"
                title="Yazıyı Düzenle"
              >
                <!--                {{ post.title }}-->
              </router-link>
            </td>
            <td>

              <!--            :style="{ background: '#' + post.category.color }"-->
              <span class="border px-3 rounded">
                <!--                  {{ post.category.title }}-->
              </span>
            </td>
            <td>

<!--              v-tooltip:top="'Username'"-->
              <router-link
                title="Oyuncu Profiline Git"
                to="#"
              >
                <img
                  alt="Oyuncu Adı"
                  class="rounded-circle border"
                  height="32"
                  src="https://minotar.net/avatar/e5eea5f735c444a28af9b2c867ade454/32"
                  width="32"
                />
              </router-link>
            </td>
            <td>0</td>
            <!--          {{ getFormattedDate(post.date) }}-->
            <td></td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination -->
    <nav class="pt-3">
      <ul class="pagination pagination-sm mb-0 justify-content-start">

        <!--        :class="{ 'disabled': page === 1 }"-->
        <!--        @click="routePage(1)"-->
        <li class="page-item">
          <a class="page-link" href="javascript:void(0);" title="Önceki Sayfa">
            <span aria-hidden="true">&laquo;</span>
          </a>
        </li>

        <!--        :class="{ 'active': index === page }"-->
        <!--        :key="index"-->
        <!--        @click="routePage(index)"-->
        <!--        v-for="index in total_page"-->
        <li class="page-item">
          <!--          v-if="page !== index"-->
          <a class="page-link" href="javascript:void(0);">
            <!--              {{index}}-->
          </a>
          <!--          v-if="page === index"-->
          <!--          {{index}}-->
          <a class="page-link"></a>
        </li>

        <!--        :class="{ 'disabled': page === total_page }"-->
        <!--        @click="routePage(total_page)"-->
        <li class="page-item">
          <a class="page-link" href="javascript:void(0);" title="Sonraki Sayfa">
            <span aria-hidden="true">&raquo;</span>
          </a>
        </li>
      </ul>
    </nav>
  </div>
</div>

<!-- Confirm Delete Post Modal -->
<div
  aria-hidden="true"
  class="modal fade"
  id="confirmDeletePost"
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
        <!--        v-text="page_type === 'trash' ? 'Bu yazıyı kalıcı olarak silmek istediğinizden emin misiniz?' : 'Bu yazıyı çöp kutusuna taşımak istediğinizden emin misiniz?'"-->
        <span></span>
      </div>
      <div class="modal-footer">
        <button
          class="btn btn-outline-primary w-100"
          data-dismiss="modal"
          type="button"
        >
          Hayır
        </button>

        <!--        :disabled="deleting"-->
        <!--        @click="page_type === 'trash' ? deletePost() : moveToTrash()"-->
        <button class="btn btn-danger w-100" type="button">
          <!--          v-if="deleting"-->
          <div
            class="spinner-border spinner-border-sm text-white"
            role="status"
          ></div>
          <!--          v-if="!deleting"-->
          <span>Evet</span>
        </button>
      </div>
    </div>
  </div>
</div>
