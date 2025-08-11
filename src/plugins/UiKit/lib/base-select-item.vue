<script setup lang="ts">
import type { SelectApi } from './base-select.vue';
import { inject } from 'vue';
import { BaseCheckbox } from '.';
import { SELECT_INJECT_KEY } from './base-select.vue';

export interface Props {
  value: unknown;
  selected?: boolean;
}
defineProps<Props>();

const selectApi = inject<SelectApi>(SELECT_INJECT_KEY)!;
</script>

<template>
  <BaseMenuItem class="select-menu-item" @click="selectApi.onSelect(value)">
    <div
      v-focus="{ autofocus: selected }"
      :class="{ 'menu-active': selected && !selectApi.multiple }"
    >
      <template v-if="selectApi.multiple">
        <slot name="label">
          <div class="w-full flex flex-row items-center justify-between">
            <slot />
            <BaseCheckbox :checked="selected" />
          </div>
        </slot>
      </template>
      <slot v-else />
    </div>
  </BaseMenuItem>
</template>

<style scoped>
/* speechify hack */
.select-menu-item > div:not(._) {
  @apply flex;
}
</style>
