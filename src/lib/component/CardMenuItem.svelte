<li class="nav-item">
  <a class="nav-link {disabled && 'disabled'}" aria-current="page" href="{base + href}" aria-disabled="{disabled}"
     class:active="{matching(
            $page.url.pathname,
            base + href,
            startsWith,
          )}"
  ><slot/></a>
</li>

<script>
  import { page } from "$app/stores";
  import { base } from "$app/paths";

  export let href
  export let startsWith
  export let disabled

  function matching(path, pathName, startsWith = false) {
    return (
      path.toUpperCase() === pathName.toUpperCase() ||
      path.toUpperCase() === (pathName + "/").toUpperCase() ||
      (startsWith && path.startsWith(pathName))
    );
  }
</script>