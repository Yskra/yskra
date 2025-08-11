<script setup lang="ts">
import { DaisyUI } from '.';
import getVanillaInput from './vanila-input';

/** @docs https://daisyui.com/components/checkbox/ */

const Checkbox = getVanillaInput('checkbox');

const colors = Object.freeze({
  neutral: 'btn-neutral', // neutral color
  primary: 'btn-primary', // primary color
  secondary: 'btn-secondary', // secondary color
  accent: 'btn-accent', // accent color
  info: 'btn-info', // info color
  success: 'btn-success', // success color
  warning: 'btn-warning', // warning color
  error: 'btn-error', // error color
});

const sizes = Object.freeze({
  xs: 'btn-xs', // Tiny size
  sm: 'btn-sm', // Small size
  md: 'btn-md', // Medium size (default)
  lg: 'btn-lg', // Large size
  xl: 'btn-xl', // Extra large size
});
</script>

<template>
  <DaisyUI
    :is="Checkbox"
    class="checkbox"
    :colors="colors"
    :sizes="sizes"
  />
</template>

<style scoped>
.toggle:focus {
  @apply focus-cursor;
}
</style>
