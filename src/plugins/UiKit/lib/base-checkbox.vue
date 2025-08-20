<script setup lang="ts">
import { DaisyUI } from '.';
import getVanillaInput from './vanila-input';

/** @docs https://daisyui.com/components/checkbox/ */

const Checkbox = getVanillaInput('checkbox');

const colors = Object.freeze({
  neutral: 'checkbox-neutral', // neutral color
  primary: 'checkbox-primary', // primary color
  secondary: 'checkbox-secondary', // secondary color
  accent: 'checkbox-accent', // accent color
  info: 'checkbox-info', // info color
  success: 'checkbox-success', // success color
  warning: 'checkbox-warning', // warning color
  error: 'checkbox-error', // error color
});

const sizes = Object.freeze({
  xs: 'checkbox-xs', // Tiny size
  sm: 'checkbox-sm', // Small size
  md: 'checkbox-md', // Medium size (default)
  lg: 'checkbox-lg', // Large size
  xl: 'checkbox-xl', // Extra large size
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
