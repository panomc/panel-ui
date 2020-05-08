<script>
  import { isPageInitialized } from "../../Store";
  import Icon from "svelte-awesome";
  import { faListAlt } from "@fortawesome/free-regular-svg-icons";
  import { faTicketAlt } from "@fortawesome/free-solid-svg-icons";

  import ConfirmCloseTicketModal from "../../components/modals/ConfirmCloseTicketModal.svelte";
  isPageInitialized.set(true);
</script>

<!-- Tickets Page -->

<div class="row mb-3">
  <div class="col-md-4 col-6">
    <a class="btn btn-link" role="button" href="/panel/tickets/categories">
      <Icon data="{faListAlt}" class="mr-1" />
      Kategoriler
    </a>
  </div>
</div>

<!-- All Tickets -->
<div class="card">
  <div class="card-body">
    <div class="row justify-content-between">
      <div class="col-md-6 col-12 text-md-left text-center">
        <h5 class="card-title">
          <!--              {{ tickets_count }} -->
          Talep -
          <!--            {{ page }}-->
          <!--            {{ total_page }}-->
          <span class="text-primary">/</span>
        </h5>
      </div>
      <div class="col-md-6 col-12 text-md-right text-center">
        <div class="btn-group">
          <!--            :class="{ 'active': page_type === 'all' }"-->
          <a
            class="btn btn-sm btn-outline-light btn-link"
            role="button"
            href="/panel/tickets/all"
          >
            Tümü
          </a>
          <!--            :class="{ 'active': page_type === 'waitingReply' }"-->
          <a
            class="btn btn-sm btn-outline-light btn-link"
            role="button"
            href="/panel/tickets/waitingReply"
          >
            Yanıtlanmadı
          </a>
          <!--            :class="{ 'active': page_type === 'closed' }"-->
          <a
            class="btn btn-sm btn-outline-light btn-link text-danger"
            role="button"
            href="/panel/tickets/closed"
          >
            Kapalı
          </a>
        </div>
      </div>
    </div>

    <!-- No Tickets -->
    <div class="container text-center" v-if="tickets_count === 0">
      <Icon data="{faTicketAlt}" scale="3" class="text-glass m-3" />
      <p class="text-gray">Burada içerik yok.</p>
    </div>

    <!-- Tickets Table -->
    <div class="table-responsive" v-if="tickets_count !== 0">
      <table class="table mb-0">
        <thead>
          <tr>
            <th scope="col">
              <a href="#">Seç</a>
            </th>
            <th scope="col">Talep</th>
            <th class="min-w-200px" scope="col">Konu</th>
            <th scope="col">Durum</th>
            <th scope="col">Kategori</th>
            <th scope="col">Yazan</th>
            <th scope="col">Son Yanıt</th>
          </tr>
        </thead>
        <tbody>
          <tr :key="index" v-for="(ticket, index) in tickets">
            <th scope="row">
              <div class="d-flex flex-row align-items-center">
                <div class="custom-control custom-checkbox">
                  <input
                    class="custom-control-input"
                    id="postCheck"
                    type="checkbox"
                  />
                  <label class="custom-control-label" for="postCheck"></label>
                </div>
              </div>
            </th>
            <td>
              <!--              {{ ticket.id }}-->
              <b class="text-muted" title="Talep NO">#</b>
            </td>
            <td>
              <!-- :href="'/panel/tickets/' + ticket.id" -->
              <a href="/panel/tickets/" title="Talebi Görüntüle">
                <!--                  {{ ticket.title }}-->
              </a>
            </td>
            <td>
              <span
                class="text-center rounded border"
                v-if="ticket.status === 1"
              >
                Yanıtlandı
              </span>
              <span
                class="text-center rounded bg-success text-white"
                v-if="ticket.status === 2"
              >
                Yeni
              </span>
              <span
                class="text-center rounded bg-danger text-white"
                v-if="ticket.status === 0"
              >
                Kapalı
              </span>
            </td>
            <!--            {{ ticket.category.title }}-->
            <td></td>
            <!--            {{ ticket.writer.username }}-->
            <td></td>
            <td>1 saat önce</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination -->
    <nav class="pt-3">
      <ul class="pagination pagination-sm mb-0 justify-content-start">
        <!--          :class="{ 'disabled': page === 1 }"-->
        <!--          @click="routePage(1)"-->
        <li class="page-item">
          <a class="page-link" href="javascript:void(0);" title="Önceki Sayfa">
            <span aria-hidden="true">&laquo;</span>
          </a>
        </li>

        <!--          :class="{ 'active': index === page }"-->
        <!--          :key="index"-->
        <!--          @click="routePage(index)"-->
        <!--          v-for="index in total_page"-->
        <li class="page-item">
          <a class="page-link" href="javascript:void(0);" v-if="page !== index">
            <!--                {{index}}-->
          </a>
          <!--            {{index}}-->
          <a class="page-link" href="#">?</a>
          <!-- v-if="page === index" -->
        </li>

        <!--          :class="{ 'disabled': page === total_page }"-->
        <!--          @click="routePage(total_page)"-->
        <li class="page-item">
          <a class="page-link" href="javascript:void(0);" title="Sonraki Sayfa">
            <span aria-hidden="true">&raquo;</span>
          </a>
        </li>
      </ul>
    </nav>
  </div>
</div>

<ConfirmCloseTicketModal />
