<script>
  import tooltip from "../../util/tooltip.util"

  import Icon from "svelte-awesome";
  import {
    faCog,
    faSync,
    faQuestion
  } from "@fortawesome/free-solid-svg-icons";
</script>

<div
  class="sidebar-bottom px-2 py-2 w-100 d-flex align-items-center
    justify-content-between bg-primary border-top border-right border-glass">
  <router-link
    class="btn btn-link text-light"
    to="/panel/settings"
    use:tooltip={["top","Ayarlar"]}>
    <Icon data={faCog}/>
  </router-link>
  <router-link
    class="btn btn-link text-light"
    to="/panel/settings/updates"
    use:tooltip={["top", "Güncellemeler"]}>
    <Icon data={faSync}/>
  </router-link>
  <a
    class="btn btn-link text-light"
    href="https://panomc.com/discord"
    target="_blank"
    use:tooltip={["top", "Yardım"]}>
    <Icon data={faQuestion}/>
  </a>
</div>