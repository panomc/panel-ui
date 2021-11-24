<div class="sidebar-bottom p-2 border-top border-right border-glass">
  <a
    class="btn btn-link text-light"
    href="{base}/settings"
    use:tooltip="{['Ayarlar', { placement: 'top' }]}"
  >
    <i class="fas fa-cog"></i>
  </a>
  <a
    class="btn btn-link text-light"
    href="{base}/settings/updates"
    use:tooltip="{['Güncellemeler', { placement: 'top' }]}"
  >
    <i class="fas fa-sync"></i>
  </a>
  <a
    class="btn btn-link text-light"
    href="https://panomc.com/discord"
    target="_blank"
    use:tooltip="{['Yardım', { placement: 'top' }]}"
  >
    <i class="fab fa-discord"></i>
  </a>
</div>

<script>
  import { base } from "$app/paths";

  import tooltip from "$lib/tooltip.util";
</script>
