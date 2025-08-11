<script setup lang="ts">
import { DaisyUI } from '.';
/** @docs https://daisyui.com/components/link/ */

const styles = Object.freeze({
  hover: 'link-hover', // underline on hover
});

const colors = Object.freeze({
  neutral: 'link-neutral', // neutral color
  primary: 'link-primary', // primary color
  secondary: 'link-secondary', // secondary color
  accent: 'link-accent', // accent color
  success: 'link-success', // success color
  info: 'link-info', // info color
  warning: 'link-warning', // warning color
  error: 'link-error', // error color
});
</script>

<template>
  <DaisyUI
    is="a"
    class="link"
    :styles="styles"
    :colors="colors"
  >
    <slot />
  </DaisyUI>
</template>
