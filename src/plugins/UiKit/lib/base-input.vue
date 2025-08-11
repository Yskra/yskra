<script setup lang="ts">
import { DaisyUI } from '.';
import getVanillaInput from './vanila-input';

/** @docs https://daisyui.com/components/input/ */

const Input = getVanillaInput('text');

const styles = Object.freeze({
  ghost: 'input-ghost', // ghost style
});

const colors = Object.freeze({
  neutral: 'input-neutral', // neutral color
  primary: 'input-primary', // primary color
  secondary: 'input-secondary', // secondary color
  accent: 'input-accent', // accent color
  info: 'input-info', // info color
  success: 'input-success', // success color
  warning: 'input-warning', // warning color
  error: 'input-error', // error color
});

const sizes = Object.freeze({
  xs: 'input-xs', // Tiny size
  sm: 'input-sm', // Small size
  md: 'input-md', // Medium size (default)
  lg: 'input-lg', // Large size
  xl: 'input-xl', // Extra large size
});
</script>

<template>
  <DaisyUI
    :is="Input"
    v-focus
    class="input"
    :styles="styles"
    :colors="colors"
    :sizes="sizes"
  >
    <slot />
  </DaisyUI>
</template>

<style scoped>
.input:focus {
  @apply focus-cursor;
}
</style>

