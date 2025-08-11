<script lang="ts">
export const FILTER_INJECT_KEY = Symbol('filter key');
</script>

<script setup lang="ts">
import type { Component } from 'vue';
import { getCurrentInstance, provide } from 'vue';
import { DaisyUI } from '.';

const { is = 'form' } = defineProps<{ is?: string | Component }>();
const instance = getCurrentInstance();
const uid = instance?.uid;

/** @docs https://daisyui.com/components/filter/ */

provide(FILTER_INJECT_KEY, uid);
</script>

<template>
  <DaisyUI
    :is="is"
    class="filter"
  >
    <slot />
  </DaisyUI>
</template>

<style>
.filter input:not(:last-child) {
  margin-inline-end: .25rem;
}

.filter:not(:has(input:checked:not(.filter-reset))) .filter-reset,
.filter:not(:has(input:checked:not(.filter-reset))) input[type="reset"],
.filter:has(input:checked:not(.filter-reset)) input:not(:checked, .filter-reset, input[type="reset"]) {
  opacity: 0;
  border-width: 0;
  width: 0;
  margin-inline: 0;
  padding-inline: 0;
  scale: 0;
}
</style>
