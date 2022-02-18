<nav class="nav justify-content-around w-100 py-1 position-absolute bottom-0">
  <a
    class="nav-link text-light"
    href="{base}/settings"
    use:tooltip="{['Ayarlar', { placement: 'top' }]}">
    <i class="fas fa-cog"></i>
  </a>
  <a
    class="nav-link text-light"
    href="javascript:void(0);"
    use:tooltip="{['Pano Market', { placement: 'top' }]}">
    <i class="fas fa-store-alt"></i>
  </a>
  <a
    class="nav-link text-light"
    href="https://panomc.com/discord"
    target="_blank"
    use:tooltip="{['Yardım', { placement: 'top' }]}">
    <i class="fab fa-discord"></i>
  </a>
</nav>

<script>
  import { base } from "$app/paths";

  import tooltip from "$lib/tooltip.util";
</script>
