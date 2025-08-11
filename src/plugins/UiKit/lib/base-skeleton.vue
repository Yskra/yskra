<script setup lang="ts">
import type { Component } from 'vue';
import { DaisyUI } from '.';

const { is = 'div' } = defineProps<{ is?: string | Component }>();

/** @docs https://daisyui.com/components/skeleton/ */
</script>

<template>
  <DaisyUI
    :is="is"
    class="skeleton"
  />
</template>
