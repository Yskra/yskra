<script setup lang="ts">
import { DaisyUI } from '.';
/** @docs https://daisyui.com/components/collapse/ */

const modifiers = Object.freeze({
  arrow: 'collapse-arrow', // Adds arrow icon
  plus: 'collapse-plus', // Adds plus/minus icon
});

const opened = defineModel({ type: Boolean, default: false });
</script>

<template>
  <DaisyUI
    is="div"
    v-focus-section
    class="p-2 collapse"
    :modifiers="modifiers"
    :class="{ 'collapse-open': opened }"
  >
    <div
      v-focus
      class="min-h-13 cursor-pointer p-2.5 collapse-title"
      @click="opened = !opened"
    >
      <slot name="title" />
    </div>
    <div class="collapse-content">
      <slot />
    </div>
  </DaisyUI>
</template>

<style>
.collapse .collapse-title:focus {
  outline-offset: 0.2rem;
  outline: var(--color-neutral-content) solid 0.3rem;
  border-radius: var(--radius-field);
}
</style>
