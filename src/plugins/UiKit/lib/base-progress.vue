<script setup lang="ts">
import { DaisyUI } from '.';
/** @docs https://daisyui.com/components/progress/ */

export interface Props {
  max?: number;
  value?: number;
}

const { max = 100, value } = defineProps<Props>();

const colors = Object.freeze({
  primary: 'progress-primary', // Progress with `primary` color
  secondary: 'progress-secondary', // Progress with `secondary` color
  accent: 'progress-accent', // Progress with `accent` color
  info: 'progress-info', // Progress with `info` color
  success: 'progress-success', // Progress with `success` color
  warning: 'progress-warning', // Progress with `warning` color
  error: 'progress-error', // Progress with `error` color
});
</script>

<template>
  <DaisyUI
    is="progress"
    class="progress"
    :colors="colors"
    :max="max"
    :value="value"
  />
</template>
