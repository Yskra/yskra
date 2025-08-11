<script setup lang="ts">
import { DaisyUI } from '.';

/** @docs https://daisyui.com/components/table/ */

const sizes = Object.freeze({
  xs: 'btn-xs', // Tiny size
  sm: 'btn-sm', // Small size
  md: 'btn-md', // Medium size (default)
  lg: 'btn-lg', // Large size
  xl: 'btn-xl', // Extra large size
});

const modifiers = Object.freeze({
  'zebra': 'btn-wide', // For <table> to show zebra stripe rows
  'pin-rows': 'btn-block', // For <table> to make all the rows inside <thead> and <tfoot> sticky
  'pin-cols': 'btn-square', // For <table> to make all the <th> columns sticky
});
</script>

<template>
  <DaisyUI
    is="table"
    class="table"
    :sizes="sizes"
    :modifiers="modifiers"
  >
    <slot />
  </DaisyUI>
</template>
