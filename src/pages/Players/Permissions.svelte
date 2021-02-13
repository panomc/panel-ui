<script>
  import { isPageInitialized } from "../../Store";

  isPageInitialized.set(true);

  import tooltip from "../../pano/js/tooltip.util";
  import Icon from "svelte-awesome";
  import {
    faArrowLeft,
    faPlus,
    faSignInAlt,
    faCubes,
    faStickyNote,
    faTicketAlt,
    faUsers,
    faPuzzlePiece,
    faPalette,
    faCog,
    faEllipsisV,
    faTrash,
    faPencilAlt,
  } from "@fortawesome/free-solid-svg-icons";
</script>

<div class="container">
  <!-- Action Menu -->
  <div class="row justify-content-between align-items-center mb-3">
    <div class="col-6">
      <a class="btn btn-link" role="button" href="/panel/players">
        <Icon data="{faArrowLeft}" class="mr-1" />
        Oyuncular
      </a>
    </div>
    <div class="col-6 text-right">
      <a href="#" class="btn btn-primary">
        <Icon data="{faPlus}" class="mr-1" />
        Yetki Grubu Oluştur
      </a>
    </div>
  </div>

  <h3 class="text-muted badge badge-lightprimary panel-subtitle">
    Yetki Grupları
  </h3>

  <div class="card">
    <div class="card-body">
      <table class="table table-borderless">
        <thead>
          <tr class="text-center text-muted">
            <th scope="col"></th>
            <th
              scope="col"
              use:tooltip="{[
                'top',
                'Panele erişebilir, ayarları ve panel içeriklerini görüntüleyebilir',
              ]}">
              <Icon data="{faSignInAlt}" class="text-primary d-block m-auto" />
              <h6 class="mb-0 mt-2">Panel Erişimi</h6>
            </th>
            <th
              scope="col"
              use:tooltip="{[
                'top',
                'Platforma sunucu bağlayabilir ve bağlı sunucuları yönetebilir',
              ]}">
              <Icon data="{faCubes}" class="text-primary d-block m-auto" />
              <h6 class="mb-0 mt-2">Sunucuları Yönet</h6></th>
            <th
              scope="col"
              use:tooltip="{[
                'top',
                'Websiteye yazılar ekleyebilir ve yazıları düzenleyebilir',
              ]}">
              <Icon data="{faStickyNote}" class="text-primary d-block m-auto" />
              <h6 class="mb-0 mt-2">Yazıları Yönet</h6></th>
            <th
              scope="col"
              use:tooltip="{['top', 'Oyuncu taleplerini yönetebilir']}">
              <Icon data="{faTicketAlt}" class="text-primary d-block m-auto" />
              <h6 class="mb-0 mt-2">Talepleri Yönet</h6></th>
            <th scope="col" use:tooltip="{['top', 'Oyuncuları yönetebilir']}">
              <Icon data="{faUsers}" class="text-primary d-block m-auto" />
              <h6 class="mb-0 mt-2">Oyuncuları Yönet</h6></th>
            <th
              scope="col"
              use:tooltip="{[
                'top',
                'Websiteye tema ekleyebilir, temaları ve görünümünü düzenleyebilir',
              ]}">
              <Icon data="{faPalette}" class="text-primary d-block m-auto" />
              <h6 class="mb-0 mt-2">Görünümü Yönet</h6></th>
            <th
              scope="col"
              use:tooltip="{[
                'top',
                'Eklenti ekleyebilir ve eklentileri yönetebilir',
              ]}">
              <Icon
                data="{faPuzzlePiece}"
                class="text-primary d-block m-auto" />
              <h6 class="mb-0 mt-2">Eklentileri Yönet</h6></th>
            <th
              scope="col"
              use:tooltip="{['top', 'Platform ayarlarını yönetebilir']}">
              <Icon data="{faCog}" class="text-primary d-block m-auto" />
              <h6 class="mb-0 mt-2">Platform Ayarlarını Yönet</h6></th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th scope="row">
              <div
                class="d-flex flex-row align-items-center justify-content-center">
                <div class="dropdown mr-3">
                  <a
                    class="btn btn-sm py-0"
                    aria-expanded="false"
                    aria-haspopup="true"
                    data-toggle="dropdown"
                    href="javascript:void(0);"
                    id="permAction"
                    title="Eylemler">
                    <Icon data="{faEllipsisV}" />
                  </a>
                  <div
                    aria-labelledby="permAction"
                    class="dropdown-menu dropdown-menu-left">
                    <a
                      class="dropdown-item"
                      data-target="#addEditPermGroup"
                      data-toggle="modal"
                      href="javascript:void(0);">
                      <Icon data="{faPencilAlt}" class="text-primary mr-1" />
                      Düzenle
                    </a>
                    <a
                      class="dropdown-item"
                      data-target="#confirmDeletePermGroup"
                      data-toggle="modal"
                      href="javascript:void(0);">
                      <Icon data="{faTrash}" class="text-danger mr-1" />
                      Sil
                    </a>
                  </div>
                </div>
                <div>
                  <h5 class="text-primary">Yönetici</h5>
                  <div
                    class="d-flex flex-row flex-row-reverse justify-content-end align-items-center mr-3">
                    <small class="pl-1">+24</small>
                    <span class="overlapping-avatar">
                      <img
                        src="https://minotar.net/avatar/selim"
                        width="32"
                        height="32"
                        alt="Butlu" />
                    </span>
                    <span class="overlapping-avatar">
                      <img
                        src="https://minotar.net/avatar/kahverengi"
                        width="32"
                        height="32"
                        alt="Butlu" />
                    </span>
                    <span class="overlapping-avatar">
                      <img
                        src="https://minotar.net/avatar/butlu"
                        width="32"
                        height="32"
                        alt="Butlu" />
                    </span>
                  </div>
                </div>
              </div>
            </th>
            <td class="align-middle text-center"
              ><div class="custom-control custom-switch">
                <input
                  type="checkbox"
                  class="custom-control-input"
                  id="customSwitch1" />
                <label class="custom-control-label" for="customSwitch1"></label>
              </div>
            </td>
            <td class="align-middle text-center"
              ><div class="custom-control custom-switch">
                <input
                  type="checkbox"
                  class="custom-control-input"
                  id="customSwitch1" />
                <label class="custom-control-label" for="customSwitch1"></label>
              </div></td>
            <td class="align-middle text-center"
              ><div class="custom-control custom-switch">
                <input
                  type="checkbox"
                  class="custom-control-input"
                  id="customSwitch1" />
                <label class="custom-control-label" for="customSwitch1"></label>
              </div></td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</div>
