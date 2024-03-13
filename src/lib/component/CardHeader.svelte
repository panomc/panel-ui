<div class="row justify-content-between align-items-center mb-3">
  <div class="col-xl-3 col-12">
    <slot name="left"/>
  </div>
  <div class="col-xl-6 col d-flex justify-content-xl-center">
    <!-- Submenu -->
    <slot name="middle"/>
  </div>
  <div class="col-xl-3 col d-flex justify-content-end">
    <!-- Filters -->
    <slot name="right"/>
  </div>
</div>