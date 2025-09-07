<script setup lang="ts">
defineOptions({
  registerIgnore: true,
});
const props = defineProps<{
  type?: 'title';
}>();
</script>

<template>
  <component
    is="li"
    class="menu-item"
    :type="props.type"
  >
    <slot />
  </component>
</template>

<style scoped>
.menu-item {
  @apply relative flex flex-col flex-wrap items-stretch line-height-[2.5rem];

  > * {
    @apply flex hover:bg-[rgba(243,248,255,.1)] gap-1 py-2 px-2 rounded-sm items-center select-none cursor-pointer;
  }

  &[disabled="true"], &[disabled=""] {
    @apply opacity-50 cursor-not-allowed;
  }
  &[type="title"] > * {
    @apply text-sm font-bold color-[rgba(243,248,255,.4)] px-2 py-1;
  }
}
</style>
