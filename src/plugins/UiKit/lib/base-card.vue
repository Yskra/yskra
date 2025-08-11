<script setup lang="ts">
import { DaisyUI } from '.';

/** @docs https://daisyui.com/components/card/ */

const styles = Object.freeze({
  border: 'card-border', // Adds border to <card>
  dash: 'card-dash', // dash style
});

const sizes = Object.freeze({
  xs: 'card-xs', // Tiny size
  sm: 'card-sm', // Small size
  md: 'card-md', // Medium size (default)
  lg: 'card-lg', // Large size
  xl: 'card-xl', // Extra large size
});

const modifiers = Object.freeze({
  side: 'card-side', // The image in <figure> will be on to the side
  full: 'image-full', // The image in <figure> element will be the background
});
</script>

<template>
  <DaisyUI
    is="div"
    class="card"
    :styles="styles"
    :sizes="sizes"
    :modifiers="modifiers"
  >
    <slot name="figure" />

    <div class="card-body">
      <h2 class="card-title">
        <slot name="title" />
      </h2>
      <slot />
      <div class="justify-end card-actions">
        <slot name="actions" />
      </div>
    </div>
  </DaisyUI>
</template>

<style>
.card-title {
  @apply text-base;
}
</style>
