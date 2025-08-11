<script setup lang="ts">
import { DaisyUI } from '.';
/** @docs https://daisyui.com/components/select/ */

const classes: Record<string, string> = Object.freeze({
  primary: 'select-primary', // Select with `primary` color
  secondary: 'select-secondary', // Select with `secondary` color
  accent: 'select-accent', // Select with `accent` color
  info: 'select-info', // Select with `info` color
  success: 'select-success', // Select with `success` color
  warning: 'select-warning', // Select with `warning` color
  error: 'select-error', // Select with `error` color
  bordered: 'select-bordered', // Adds border to select
  ghost: 'select-ghost', // Adds ghost style to select
  lg: 'select-lg', // Large select
  md: 'select-md', // Medium select (default)
  sm: 'select-sm', // Small select
  xs: 'select-xs', // Tiny select
});
</script>

<template>
  <DaisyUI
    is="select"
    class="select"
    :classes="classes"
  >
    <slot />
  </DaisyUI>
</template>
