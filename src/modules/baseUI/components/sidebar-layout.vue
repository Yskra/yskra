<script setup lang="ts">
defineOptions({
  registerIgnore: true,
});
</script>

<template>
  <div class="sidebar-layout">
    <div>
      <slot name="sidebar" :compact-sidebar="false" />
    </div>
    <div
      class="sidebar-layout-body"
    >
      <slot :compact-sidebar="false" />
    </div>
  </div>
</template>

<style scoped>
.sidebar-layout {
  @apply flex;
}
.sidebar-layout-body {
  @apply ml-2 shrink grow flex-basis-0 overflow-y-auto;
}
</style>
