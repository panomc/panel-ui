<!--suppress JSUnusedAssignment, BadExpressionStatementJS, ES6UnusedImports -->
<script>
  import Loadable from 'svelte-loadable'
  import {get} from 'svelte/store'
  import {isPageChanged, isPageLoading} from './RouterStore'
  import {isPageGonnaInitialize, isPageInitialized} from './Store'

  export let component;
  export let dynamicImport;
  export let delay = 0;

  function flashPrevent(node) {
    return {
      duration: 4000,
      tick: t => {
        if (get(isPageChanged)) {
          node.style.display = 'none'
        } else {
          node.style.display = 'block'
        }
      }
    }
  }

  // use component variable for nothing (fix useless svelte warning)
  component;
</script>

<Loadable loader={dynamicImport} {delay}>
  <div slot="loading">
    isInitialPageInitialized
      {(isPageLoading.set(true)) ? '' : ''}

      {(isPageChanged.set(false)) ? '' : ''}
  </div>

  <div
    out:flashPrevent
    slot="success"
    let:component
  >
    <svelte:component this={component}/>
      {$isPageGonnaInitialize ? '' : isPageInitialized.set(true) ? '' : ''}

      {(isPageLoading.set(false)) ? '' : ''}

      {(isPageChanged.set(true)) ? '' : ''}
  </div>

</Loadable>