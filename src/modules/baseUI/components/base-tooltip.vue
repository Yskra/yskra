<script setup lang="ts">
import type { Component } from 'vue';

defineOptions({
  registerIgnore: true,
});
const props = withDefaults(defineProps<{ is?: string | Component; dataTip?: string }>(), {
  is: 'div',
});
</script>

<template>
  <component
    :is="props.is"
    :title="props.dataTip"
    :tabindex="0"
  >
    <div v-if="'content' in $slots">
      <slot name="content" />
    </div>

    <slot />
  </component>
</template>
