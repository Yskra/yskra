<script setup lang="ts">
import type { Component } from 'vue';
import { DaisyUI } from '.';

/** @docs https://daisyui.com/components/button/ */

const { is = 'button' } = defineProps<{ is?: string | Component }>();

const styles = Object.freeze({
  outline: 'btn-outline', // outline style
  soft: 'btn-soft', // soft style
  ghost: 'btn-ghost', // ghost style
  link: 'btn-link', // looks like a link
  active: 'btn-active', // looks active
  disabled: 'btn-disabled', // looks disabled
});

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

const modifiers = Object.freeze({
  wide: 'btn-wide', // more horizontal padding
  block: 'btn-block', // Full width
  square: 'btn-square', // 1:1 ratio
  circle: 'btn-circle', // 1:1 ratio with rounded corners
});
</script>

<template>
  <DaisyUI
    :is="is"
    v-focus
    class="btn"
    :styles="styles"
    :colors="colors"
    :sizes="sizes"
    :modifiers="modifiers"
    disabled-class="btn-disabled"
  >
    <slot />
  </DaisyUI>
</template>

<style>
.btn {
  @apply text-sm;
}

.btn:focus {
  @apply focus-cursor;
}
</style>
