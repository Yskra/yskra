<script setup lang="ts">
import type { SelectApi } from './base-select.vue';
import { inject } from 'vue';
import { SELECT_INJECT_KEY } from './base-select.vue';

export interface Props {
  value: unknown;
  selected?: boolean;
}
defineOptions({
  registerIgnore: true,
});
defineProps<Props>();
const selectApi = inject<SelectApi>(SELECT_INJECT_KEY)!;
</script>

<template>
  <BaseMenuItem class="" @click="selectApi.onSelect(value)">
    <div
      class=""
      :class="{ active: selected }"
    >
      <slot />
    </div>
  </BaseMenuItem>
</template>

<style scoped>
.select-item {
  @apply min-h-10 flex cursor-pointer items-center justify-between p-2 text-sm hover:bg-white/10;
}
.active {
  @apply bg-base-300;
}
</style>
