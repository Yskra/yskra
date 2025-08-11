<script setup lang="ts">
import type { Component } from 'vue';
import { DaisyUI } from '.';

/** @docs https://daisyui.com/components/badge/ */

const props = withDefaults(defineProps<{ is?: string | Component }>(), {
  is: 'div',
});

const styles = Object.freeze({
  outline: 'badge-outline', // outline style
  dash: 'badge-dash', // dash outline style
  soft: 'badge-soft', // soft style
  ghost: 'badge-ghost', // ghost style
});

const colors = Object.freeze({
  neutral: 'badge-neutral', // neutral color
  primary: 'badge-primary', // primary color
  secondary: 'badge-secondary', // secondary color
  accent: 'badge-accent', // accent color
  info: 'badge-info', // info color
  success: 'badge-success', // success color
  warning: 'badge-warning', // warning color
  error: 'badge-error', // error color
});

const sizes = Object.freeze({
  xs: 'badge-xs', // tiny size
  sm: 'badge-sm', // small size
  md: 'badge-md', // medium size (default)
  lg: 'badge-lg', // large size
  xl: 'badge-xl', // extra large size
});
</script>

<template>
  <DaisyUI
    :is="props.is"
    class="badge"
    :styles="styles"
    :colors="colors"
    :sizes="sizes"
  >
    <slot />
  </DaisyUI>
</template>

<style>
.badge {
  @apply text-sm;
}
</style>
