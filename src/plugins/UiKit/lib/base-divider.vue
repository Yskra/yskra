<script setup lang="ts">
import type { Component } from 'vue';
import { DaisyUI } from '.';

/** @docs https://daisyui.com/components/divider/ */

const props = withDefaults(defineProps<{ is?: string | Component }>(), {
  is: 'div',
});

const colors = Object.freeze({
  neutral: 'divider-neutral', // neutral color
  primary: 'divider-primary', // primary color
  secondary: 'divider-secondary', // secondary color
  accent: 'divider-accent', // accent color
  info: 'divider-info', // info color
  success: 'divider-success', // success color
  warning: 'divider-warning', // warning color
  error: 'divider-error', // error color
});

const directions = Object.freeze({
  vertical: 'divider-vertical', // Divide vertical elements (on top of each other) [Default]
  horizontal: 'divider-horizontal', // Divide horizontal elements (next to each other)
});

const placements = Object.freeze({
  start: 'divider-start', // Pushes the divider text to the start
  end: 'divider-end', // Pushes the divider text to the end
});
</script>

<template>
  <DaisyUI
    :is="props.is"
    class="divider"
    :colors="colors"
    :directions="directions"
    :placements="placements"
  >
    <slot />
  </DaisyUI>
</template>

<style>
.divider {
  @apply text-sm;
}
</style>
