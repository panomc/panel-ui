<div class="sidebar-bottom p-2 border-top border-right border-glass">
  <a
    class="btn btn-link text-light"
    href="/panel/settings"
    use:tooltip="{['top', 'Ayarlar']}">
    <Icon data="{faCog}" />
  </a>
  <a
    class="btn btn-link text-light"
    href="/panel/settings/updates"
    use:tooltip="{['top', 'Güncellemeler']}">
    <Icon data="{faSync}" />
  </a>
  <a
    class="btn btn-link text-light"
    href="https://panomc.com/discord"
    target="_blank"
    use:tooltip="{['top', 'Yardım']}">
    <Icon data="{faDiscord}" />
  </a>
</div>

<script>
  import tooltip from "../../pano-ui/js/tooltip.util";

  import Icon from "svelte-awesome";
  import { faCog, faSync } from "@fortawesome/free-solid-svg-icons";
  import { faDiscord } from "@fortawesome/free-brands-svg-icons";
</script>
