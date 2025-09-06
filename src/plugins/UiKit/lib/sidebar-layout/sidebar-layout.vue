<script setup lang="ts">
import { useActiveElement } from '@vueuse/core';
import { computed, useTemplateRef } from 'vue';

const sidebarContainerRef = useTemplateRef<HTMLElement>('sidebarContainerRef');
const activeElement = useActiveElement();
const compactSidebar = computed(() => (activeElement.value && sidebarContainerRef.value) ? !sidebarContainerRef.value?.contains(activeElement.value) : false);
</script>

<template>
  <div class="flex">
    <div ref="sidebarContainerRef">
      <slot name="sidebar" :compact-sidebar="compactSidebar" />
    </div>
    <div
      class="ml-2 shrink grow flex-basis-0 overflow-y-auto"
    >
      <slot :compact-sidebar="compactSidebar" />
    </div>
  </div>
</template>
