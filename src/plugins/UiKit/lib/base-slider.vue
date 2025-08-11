<script setup lang="ts">
import { computed, ref, useAttrs } from 'vue';
import { BaseButton, DaisyUI } from '.';
import getVanillaInput from './vanila-input';

defineOptions({
  inheritAttrs: false,
});
/** @docs https://daisyui.com/components/range/ */

const Range = getVanillaInput('range');
const attrs = useAttrs();
const colors = Object.freeze({
  neutral: 'range-neutral', // neutral color
  primary: 'range-primary', // primary color
  secondary: 'range-secondary', // secondary color
  accent: 'range-accent', // accent color
  success: 'range-success', // success color
  warning: 'range-warning', // warning color
  info: 'range-info', // info color
  error: 'range-error', // error color
});

const sizes = Object.freeze({
  xs: 'range-xs', // Tiny size
  sm: 'range-sm', // Small size
  md: 'range-md', // Medium size (default)
  lg: 'range-lg', // Large size
  xl: 'range-xl', // Extra large size
});

const elementRef = ref();
const step = computed<number>(() => attrs.step as number || 1);
const min = computed<number>(() => attrs.min as number || 0);
const max = computed<number>(() => attrs.max as number || 100);
const color = computed(() => attrs.color);
const size = computed(() => attrs.size);

function updateValue(newValue: number) {
  const { $el } = elementRef.value;

  $el.value = newValue.toString();
  $el.dispatchEvent(new Event('input', { bubbles: true }));
}

function onStepUp() {
  if (elementRef.value) {
    const { $el } = elementRef.value;
    const value = Number.parseFloat($el.value);

    if (value >= max.value) {
      return;
    }
    updateValue(value + step.value);
  }
}

function onStepDown() {
  if (elementRef.value) {
    const { $el } = elementRef.value;
    const value = Number.parseFloat($el.value);

    if (value <= min.value) {
      return;
    }
    updateValue(value - step.value);
  }
}
</script>

<template>
  <div class="flex items-center">
    <DaisyUI
      :is="Range"
      ref="elementRef"
      class="range"
      :colors="colors"
      :sizes="sizes"
      c
      v-bind="attrs"
    />
    <BaseButton
      class="ml-2 mr-3 p-2"
      :color="color"
      :size="size"
      @click="onStepDown"
    >
      <div class="i-mingcute:square-arrow-left-fill h-[--size] w-[--size]" />
    </BaseButton>
    <BaseButton
      class="p-2"
      :color="color"
      :size="size"
      @click="onStepUp"
    >
      <div class="i-mingcute:square-arrow-right-fill h-[--size] w-[--size]" />
    </BaseButton>
  </div>
</template>
