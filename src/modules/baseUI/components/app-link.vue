<script setup>
import { RouterLink } from 'vue-router';

defineOptions({
  registerIgnore: true,
});
defineProps({
  activeClass: {
    type: String,
    default: '',
  },
});
</script>

<template>
  <RouterLink
    v-bind="$attrs"
    :active-class="activeClass"
    @keydown.enter.prevent
  >
    <slot />
  </RouterLink>
</template>
