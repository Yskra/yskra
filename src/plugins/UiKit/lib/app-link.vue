<script setup>
import { RouterLink } from 'vue-router';

defineProps({
  activeClass: {
    type: String,
    default: 'menu-active',
  },
});
</script>

<template>
  <RouterLink
    v-focus
    v-bind="$attrs"
    :active-class="activeClass"
    @keydown.enter.prevent
  >
    <slot />
  </RouterLink>
</template>
