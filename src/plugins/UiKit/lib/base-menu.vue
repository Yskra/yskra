<script setup lang="ts">
import { computed, mergeProps } from 'vue';
import { DaisyUI } from '.';

/**
 * @docs https://daisyui.com/components/menu/
 * note: Element in Item may have v-focus directive
 */

const { type, ...props } = defineProps<{
  type?: string;
  class?: unknown;
}>();

const types: Record<string, string> = Object.freeze({
  dropdown: 'menu-dropdown', // For the collapsible <ul> if you want to show it using JS
});

const sizes = Object.freeze({
  xs: 'menu-xs', // Tiny size
  sm: 'menu-sm', // Small size
  md: 'menu-md', // Medium size (default)
  lg: 'menu-lg', // Large size
  xl: 'menu-xl', // Extra large size
});


const directions = Object.freeze({
  vertical: 'menu-vertical', // Vertical menu (default)
  horizontal: 'menu-horizontal', // Horizontal menu
});

const newProps = computed(() => mergeProps(
  { class: (type && type in types) ? [types[type]] : ['menu'] },
  props,
));
</script>

<template>
  <DaisyUI
    is="ul"
    v-bind="newProps"
    v-focus-section
    :sizes="sizes"
    :directions="directions"
  >
    <slot />
  </DaisyUI>
</template>


<style>
.menu, .menu-title {
  @apply text-sm;
}

.menu li:not(.menu-title) {
  line-height: calc(var(--size-field, 0.25rem) * 10);
}
</style>
