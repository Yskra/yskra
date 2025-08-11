<script setup lang="ts">
import type { Component } from 'vue';
import { DaisyUI } from '.';

/** @docs https://daisyui.com/components/loading/ */

const props = withDefaults(defineProps<{ is?: string | Component }>(), {
  is: 'span',
});

const styles = Object.freeze({
  spinner: 'loading-spinner', // spinner animation
  dots: 'loading-dots', // dots animation
  ring: 'loading-ring', // ring animation
  ball: 'loading-ball', // ball animation
  bars: 'loading-bars', // bars animation
  infinity: 'loading-infinity', // infinity animation
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
    :is="props.is"
    class="loading"
    :styles="styles"
    :sizes="sizes"
  />
</template>
