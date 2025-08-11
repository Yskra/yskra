<script setup lang="ts">
import { DaisyUI } from '.';
/** @docs https://daisyui.com/components/label/ */

const styles = Object.freeze({
  input: 'input',
  floating: 'floating-label',
});
</script>

<template>
  <DaisyUI
    is="label"
    class="label1"
    :styles="styles"
  >
    <slot name="label-start" />
    <slot />
    <slot name="label-end" />
  </DaisyUI>
</template>

<style scoped>
.label1 :deep(input.input) {
  @apply outline-none border-none p-0 box-shadow-none;
}
</style>
