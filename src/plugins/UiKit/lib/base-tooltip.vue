<script setup lang="ts">
import type { Component } from 'vue';
import { computed, ref, toRef, useAttrs } from 'vue';
import { DaisyUI, type2array } from '.';

/**
 * @docs https://daisyui.com/components/tooltip/
 * @note modification: when it does not fit into the viewpoint frames, a style is added that adds the necessary indentation
 */

const props = withDefaults(defineProps<{ is?: string | Component }>(), {
  is: 'div',
});

const colors = Object.freeze({
  neutral: 'tooltip-neutral', // neutral color
  primary: 'tooltip-primary', // primary color
  secondary: 'tooltip-secondary', // secondary color
  accent: 'tooltip-accent', // accent color
  info: 'tooltip-info', // info color
  success: 'tooltip-success', // success color
  warning: 'tooltip-warning', // warning color
  error: 'tooltip-error', // error color
});

const modifiers = Object.freeze({
  open: 'tooltip-open', // Force open tooltip
});

const placements = Object.freeze({
  top: 'tooltip-top', // Put tooltip on top (Default)
  bottom: 'tooltip-bottom', // Put tooltip on bottom
  left: 'tooltip-left', // Put tooltip on left
  right: 'tooltip-right', // Put tooltip on right
});

const attrs = useAttrs();
const elementRef = ref();

const position = computed(() => {
  const position = { x: 0, y: 0 };

  if (elementRef.value) {
    const type = type2array(attrs.type as undefined);

    if (type.length === 0 || type.includes('top') || type.includes('bottom')) {
      const { $el } = elementRef.value;

      const tooltipWidth = Number.parseInt(window.getComputedStyle($el, '::before').width.replace('px', ''));
      const rect = $el.getBoundingClientRect();
      const left = rect.left;
      const right = window.innerWidth - rect.right;

      position.x = (tooltipWidth - rect.width) / 2;

      if (position.x > left) {
        position.x -= (position.x - left + 10);
      }
      if (position.x > right) {
        position.x -= (right - position.x - 10);
      }
    }
  }

  return position;
});

const style = toRef(() => ({ '--tooltip-x': `-${position.value.x}px`, '--tooltip-y': `${position.value.y}px` }));
</script>

<template>
  <DaisyUI
    :is="props.is"
    ref="elementRef"
    class="tooltip"
    :colors="colors"
    :modifiers="modifiers"
    :placements="placements"
    :style="style"
  >
    <div v-if="'content' in $slots" class="tooltip-content">
      <slot name="content" />
    </div>

    <slot />
  </DaisyUI>
</template>

<style scoped>
/*noinspection ALL*/
.tooltip:not(.tooltip-left), .tooltip:not(.tooltip-right) {
  --tooltip-x: 50%;

  &::before {
    transform: translateX(0%);
    left: var(--tooltip-x);
  }
}
</style>
