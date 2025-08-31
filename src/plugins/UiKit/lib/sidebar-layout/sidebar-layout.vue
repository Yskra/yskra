<script>

</script>

<template>
  <div class="direction-vertical flex">
    <div>
      <slot name="sidebar" />
    </div>
    <div
      class="ml-2 shrink grow flex-basis-0 overflow-y-auto"
    >
      <slot />
    </div>
  </div>
</template>
