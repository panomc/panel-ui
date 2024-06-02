<div class="row align-items-center mb-3">
  <div class="col-xl-4 col-6 order-1">
    <slot name="left" />
  </div>
  <div class="col-xl-4 col-12 order-xl-2 order-first">
    <!-- Submenu -->
    <slot name="middle" />
  </div>
  <div class="col-xl-4 col-6 d-flex justify-content-end order-3">
    <!-- Filters -->
    <slot name="right" />
  </div>
</div>
