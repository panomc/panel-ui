<script>
  import { isPageInitialized } from "../Store";

  isPageInitialized.set(true);
</script>

<!-- Settings Categories Nav -->
<nav class="border-bottom border-glass page-category">
  <div class="nav nav-pills d-flex justify-content-center flex-row w-100">
    <a class="nav-item nav-link" href="/panel/settings">
      Genel
      <!-- :class="{ 'active': currentActiveNavLink === 1 }"  -->
    </a>
    <a class="nav-item nav-link" href="/panel/settings/site-settings">
      <!-- :class="{ 'active': currentActiveNavLink === 2 }"  -->
      Website
    </a>
    <a
      class="nav-item nav-link ml-sm-auto position-relative"
      href="/panel/settings/updates">
      Güncellemeler
      <span class="notification" />
      <!-- :class="{ 'active': currentActiveNavLink === 3 }" -->
    </a>
    <a class="nav-item nav-link" href="/panel/settings/about">
      <!-- :class="{ 'active': currentActiveNavLink === 4 }"  -->
      Hakkında
    </a>
  </div>
</nav>

<!-- Settings Contents -->
<article class="content">
  <!-- <router-view></router-view> -->
</article>
