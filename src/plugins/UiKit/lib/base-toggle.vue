<script setup lang="ts">
import { DaisyUI } from '.';
import getVanillaInput from './vanila-input';

/** @docs https://daisyui.com/components/toggle/ */

const Checkbox = getVanillaInput('checkbox');

const colors = Object.freeze({
  neutral: 'toggle-neutral', // neutral color
  primary: 'toggle-primary', // primary color
  secondary: 'toggle-secondary', // secondary color
  accent: 'toggle-accent', // accent color
  info: 'toggle-info', // info color
  success: 'toggle-success', // success color
  warning: 'toggle-warning', // warning color
  error: 'toggle-error', // error color
});

const sizes = Object.freeze({
  xs: 'toggle-xs', // Tiny size
  sm: 'toggle-sm', // Small size
  md: 'toggle-md', // Medium size (default)
  lg: 'toggle-lg', // Large size
  xl: 'toggle-xl', // Extra large size
});
</script>

<template>
  <DaisyUI
    :is="Checkbox"
    v-focus
    class="toggle"
    :colors="colors"
    :sizes="sizes"
  />
</template>

<style scoped>
.toggle:focus {
  @apply focus-cursor;
}
</style>
