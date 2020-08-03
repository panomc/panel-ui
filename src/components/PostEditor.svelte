<!-- Create Post Subpage -->

<div>

  <!-- Action Menu -->
  <section class="row justify-content-between align-items-center mb-3">
    <div class="col-auto text-left">
      <!--      href="'/panel/posts' + (post.status === 0 ? '/trash' : post.status === 2 ? '/draft' : '')"-->
      <a class="btn btn-outline-primary" role="button">
        <i aria-hidden="true" class="fa fa-arrow-left fa-fw"></i>
        Tüm Yazılar
      </a>
      <a class="btn btn-link" role="button" target="_blank" href="/">
        <i aria-hidden="true" class="fa fa-eye fa-fw"></i>
        <span class="d-md-inline d-none">Yazıyı Görüntüle</span>
      </a>
    </div>
    <div class="col text-right">
      <!--      v-show="editorMode === 'edit'"-->
      <button
        class="btn btn-link text-danger"
        data-target="#confirmDeletePost"
        data-toggle="modal"
        type="button"
      >
        <i aria-hidden="true" class="fa fa-trash"></i>
      </button>
      <!--      :disabled="drafting" @click="onDraftClick"-->
      <!--      v-show="post.status !== 2 && post.id !== -1"-->
      <button class="btn btn-link" type="button">
        <!--        v-if="!drafting"-->
        <i aria-hidden="true" class="fa fa-bookmark fa-fw"></i>
        <!--        v-if="!drafting"-->
        <span class="d-md-inline d-none">Taslaklara Taşı</span>

        <!--        v-if="drafting"-->
        <div
          class="spinner-border spinner-border-sm text-primary"
          role="status"
        ></div>
      </button>
      <!--      :disabled="lengthEditorText === 0 || post.title.length === 0  || publishing" @click="onSubmit"-->
      <button class="btn btn-secondary" type="button">

        <!--        v-if="publishing"-->
        <div
          class="spinner-border spinner-border-sm text-white"
          role="status"
        ></div>

        <!--        v-if="!publishing" v-text="post.status === 1 ? 'Güncelle' : 'Yayınla'"-->
        <span>Güncelle/Yayınla</span>
      </button>
    </div>
  </section>

  <!-- Post & Post Options -->
  <section class="row">

    <!-- Post -->
    <div class="col-lg-9 d-flex flex-fill">
      <div class="card w-100">
        <div class="card-body d-flex flex-column">
          <!--          v-model="post.title"-->
          <input
            class="form-control font-weight-bolder text-muted mb-2"
            type="text"
          />

          <div class="align-selft-center w-100 h-75">
            <!-- Editor -->
            <div id="editorToolbar">
              <span class="ql-formats">
                <select class="ql-size"></select>
              </span>
              <span class="ql-formats">
                <button class="ql-bold"></button>
                <button class="ql-italic"></button>
                <button class="ql-underline"></button>
                <button class="ql-strike"></button>
              </span>
              <span class="ql-formats">
                <select class="ql-color"></select>
                <select class="ql-background"></select>
              </span>
              <span class="ql-formats">
                <button class="ql-header" value="1"></button>
                <button class="ql-header" value="2"></button>
                <button class="ql-blockquote"></button>
                <button class="ql-code-block"></button>
              </span>
              <span class="ql-formats">
                <button class="ql-list" value="ordered"></button>
                <button class="ql-list" value="bullet"></button>
                <button class="ql-indent" value="-1"></button>
                <button class="ql-indent" value="+1"></button>
              </span>
              <span class="ql-formats">
                <button class="ql-direction" value="rtl"></button>
                <select class="ql-align"></select>
              </span>
              <span class="ql-formats">
                <button class="ql-link"></button>
                <button class="ql-image"></button>
                <button class="ql-video"></button>
              </span>
            </div>

            <!--            @input="onEditorInput($event)"-->
            <div id="editor"></div>
            <!-- Editor End -->
          </div>

        </div>
      </div>
    </div>

    <!-- Post Option Cards -->
    <div class="col-lg-3">
      <div class="card">
        <div class="card-body">
          <form>
            <ul class="list-group">
              <!--              v-tooltip:left="'Durum'"-->
              <li class="list-group-item px-0 pt-0">
                <i
                  aria-hidden="true"
                  class="far fa-sticky-note text-primary fa-fw"
                ></i>
                <!--                  {{ status }}-->
                <span class="font-weight-normal"></span>
              </li>
              <!--              v-tooltip:left="'Son Düzenleme'"-->
              <li class="list-group-item px-0">
                <i
                  aria-hidden="true"
                  class="fa fa-pencil-alt text-primary fa-fw"
                ></i>
                <!--                  {{ post.date === 0 ? '-' : getFormattedDate(post.date) }}-->
                <span class="font-weight-normal"></span>
              </li>
              <!--              v-tooltip:left="'Görüntülenme'"-->
              <li class="list-group-item px-0 pb-0">
                <i aria-hidden="true" class="far fa-eye text-primary fa-fw"></i>
                <span class="font-weight-normal">0</span>
              </li>
            </ul>
          </form>
        </div>
      </div>
      <div class="card">
        <div class="card-body">
          <h6>
            <i
              aria-hidden="true"
              class="far fa-folder-open text-primary fa-fw"
            ></i>
            Kategori:
          </h6>
          <form>
            <!--            v-if="category_count === 0"-->
            <div class="container text-center">
              <i
                aria-hidden="true"
                class="far fa-list-alt fa-3x text-glass m-3"
              ></i>
              <p class="text-muted small">Hiç kategori oluşturulmamış.</p>
            </div>

            <!--            v-if="category_count > 0"-->
            <!--            v-model="post.category"-->
            <select class="form-control form-control-sm mb-3">
              <option class="text-primary" disabled value="-1">
                Kategori Seç:
              </option>
              <!--              :key="index" :value="category.id" v-for="(category, index) in categories" v-text="category.title"-->
              <option></option>
            </select>

            <a
              class="btn btn-link btn-sm btn-block"
              role="button"
              href="/panel/posts/categories"
            >
              Kategorileri Düzenle
            </a>
          </form>
        </div>
      </div>
      <div class="card">
        <div class="card-body">
          <h6>
            <i aria-hidden="true" class="far fa-image text-primary fa-fw"></i>
            Yazı Kapak Resmi:
          </h6>
          <div class="container text-center d-none">
            <i aria-hidden="true" class="far fa-image fa-3x text-glass m-3"></i>
            <p class="text-muted small">Küçük resim belirlenmedi.</p>
          </div>

          <!--          :src="post.imageCode"-->
          <!--          v-if="post.imageCode !== ''"-->
          <img
            alt="Önizleme Resmi"
            class="img-fluid rounded mb-3"
            height="auto"
            width="100%"
          />

          <!--          @change="readFile"-->
          <input
            accept="image/*"
            class="form-control-file"
            id="selectThumbnaiImage"
            type="file"
          />

          <!--          :class="{ 'text-danger': error.image, 'text-muted': !error.image }"-->
          <small>
            Küçük resim görseliniz minimum 600x300 boyutlarında ve maksimum 1 MB
            olmalı.
          </small>
        </div>
      </div>
    </div>

  </section>

  <!-- Confirm Move To Trash Modal -->
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
          <!--          v-text="post.status === 0 ? 'Bu yazıyı kalıcı olarak silmek istediğinizden emin misiniz?' : 'Bu yazıyı çöp kutusuna taşımak istediğinizden emin misiniz?'"-->
          <span></span>
        </div>
        <div class="modal-footer">
<!--          :disabled="deleting"-->
          <button
            class="btn btn-outline-primary w-100"
            data-dismiss="modal"
            type="button"
          >
            Hayır
          </button>
<!--          :disabled="deleting"-->
<!--          @click="post.status === 0 ? deletePost() : moveToTrash()"-->
          <button
            class="btn btn-danger w-100"
            type="button"
          >
            <div
              class="spinner-border spinner-border-sm text-white"
              role="status"
              v-if="deleting"
            ></div>
<!--            v-if="!deleting"-->
            <span>Evet</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</div>
