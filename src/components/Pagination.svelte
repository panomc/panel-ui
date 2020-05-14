<script>
  import { createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher();
  let pages;

  export let page;
  export let totalPage = 1;

  $: {
    pages = [];

    for (let i = 1; i <= totalPage; i++) {
      pages.push(i);
    }
  }

  function onFirstPageClick() {
    dispatch("firstPageClick", {});
  }

  function onLastPageClick() {
    dispatch("lastPageClick", {});
  }

  function onPageLinkClick(index) {
    dispatch("pageLinkClick", {
      page: index,
    });
  }
</script>

<nav class="pt-3">
  <ul class="pagination pagination-sm mb-0 justify-content-start">
    {#if page !== 1}
      <a class="page-link" href="javascript:void(0);" title="Önceki Sayfa" on:click="{onFirstPageClick}">
        <li class="page-item">
          <span aria-hidden="true">&laquo;</span>
        </li>
      </a>
    {:else}
      <li class="page-item page-link disabled" disabled="true">
        <span aria-hidden="true">&laquo;</span>
      </li>
    {/if}

    {#each pages as index}
      {#if page !== index}
        <a href="javascript:void(0);" on:click="{onPageLinkClick(index)}">
          <li class="page-item page-link">{index}</li>
        </a>
      {:else}
        <li class="page-item page-link">{index}</li>
      {/if}
    {/each}

    {#if page !== totalPage}
      <a href="javascript:void(0);" title="Sonraki Sayfa" on:click="{onLastPageClick}">
        <li class="page-item page-link">
          <span aria-hidden="true">&raquo;</span>
        </li>
      </a>
    {:else}
      <li class="page-item page-link disabled" disabled="true">
        <span aria-hidden="true">&raquo;</span>
      </li>
    {/if}
  </ul>
</nav>
