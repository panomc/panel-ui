<script>
  import { isPageInitialized } from "../../Store";
  import Icon from "svelte-awesome";
  import { faListAlt } from "@fortawesome/free-regular-svg-icons";
  import {
    faUsers,
    faEllipsisV,
    faTimes,
    faUserCircle,
    faGlobe,
  } from "@fortawesome/free-solid-svg-icons";

  isPageInitialized.set(true);
</script>

<!-- All Players Page -->
<div class="content">

  <!-- All Players -->
  <div class="card">
    <div class="card-body">
      <div class="row justify-content-between">
        <div class="col-md-6 col-12 text-md-left text-center">
          <h5 class="card-title">50 Oyuncu</h5>
        </div>
        <div class="col-md-6 col-12 text-md-right text-center">
          <div class="btn-group">
            <a
              class="btn btn-sm btn-outline-light btn-link"
              role="button"
              href="/panel/players/all"
            >
              Tümü
            </a>
            <a
              class="btn btn-sm btn-outline-light btn-link"
              role="button"
              href="/panel/players/special"
            >
              Yetkili
            </a>
            <a
              class="btn btn-sm btn-outline-light btn-link text-danger"
              role="button"
              href="/panel/players/banned"
            >
              Yasaklı
            </a>
          </div>
        </div>
      </div>

      <!-- No Players -->
      <div class="container text-center">
        <Icon data="{faUsers}" scale="3" class="text-glass m-3" />
        <p class="text-gray">Burada içerik yok.</p>
      </div>

      <!-- Posts Table -->
      <div class="table-responsive">
        <table class="table mb-0">
          <thead>
            <tr>
              <th scope="col"></th>
              <th scope="col">İsim</th>
              <th scope="col">Talepler</th>
              <th scope="col">Durum</th>
              <th scope="col">Son Oturum</th>
              <th scope="col">Kayıt</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th class="min-w-50px" scope="row">
                <div class="dropdown position-absolute">
                  <a
                    class="btn btn-sm py-0"
                    aria-expanded="false"
                    aria-haspopup="true"
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
                    <a class="dropdown-item" href="javascript:void(0);">
                      <Icon data="{faUserCircle}" class="mr-1 text-primary" />
                      Yetkilendir
                    </a>
                    <a
                      class="dropdown-item"
                      data-target="#conformBanTickets"
                      data-toggle="modal"
                      href="javascript:void(0);"
                    >
                      <Icon data="{faTimes}" class="mr-1 text-danger" />
                      Yasakla
                    </a>
                  </div>
                </div>
              </th>
              <td class="min-w-200px">
                <a title="Oyuncu Profiline Git" href="#">
                  <img
                    alt="Oyuncu Adı"
                    class="rounded-circle border mr-3"
                    height="32"
                    src="https://minotar.net/avatar/e5eea5f735c444a28af9b2c867ade454/32"
                    width="32"
                  />
                  Kahverengi
                </a>
              </td>
              <td>
                0
                <i
                  aria-hidden="true"
                  class="fa fa-times text-danger fa-fw"
                  v-tooltip:top="'Talepleri Yasaklı'"
                ></i>
              </td>
              <td>
                <span
                  class="badge badge-pill badge-lightsecondary text-success"
                  v-tooltip:top="'Sitede'"
                >
                  <i aria-hidden="true" class="fa fa-globe fa-fw"></i>
                  <Icon data="{faGlobe}" />
                  <span class="d-md-inline d-none ml-1">Çevrimiçi</span>
                </span>
              </td>
              <td>10 dakika önce</td>
              <td>01.01.2019</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <nav class="pt-3">
        <ul class="pagination pagination-sm mb-0 justify-content-start">
          <li class="page-item">
            <a
              class="page-link"
              href="javascript:void(0);"
              title="Önceki Sayfa"
            >
              <span aria-hidden="true">&laquo;</span>
            </a>
          </li>

          <li class="page-item">
            <a class="page-link" href="javascript:void(0);">1</a>
          </li>

          <li class="page-item">
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

</div>
