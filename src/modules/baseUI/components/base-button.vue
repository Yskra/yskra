<script setup lang="ts">
import type { Component } from 'vue';

defineOptions({
  registerIgnore: true,
});
const { is = 'button' } = defineProps<{ is?: string | Component }>();
</script>

<template>
  <component
    :is="is"
    class="button"
  >
    <slot />
  </component>
</template>

<style scoped>
.button {
  @apply inline-flex border-2 rounded-md p-2 text-sm border-blue items-center gap-2;
}
</style>
