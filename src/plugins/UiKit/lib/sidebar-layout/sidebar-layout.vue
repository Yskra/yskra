<script setup lang="ts">
import { useActiveElement } from '@vueuse/core';
import { computed, ref, useTemplateRef } from 'vue';

const sidebarContainerRef = useTemplateRef<HTMLElement>('sidebarContainerRef');
const activeElement = useActiveElement();

const hoveredContainer = ref(false);
const compactSidebar = computed(() => hoveredContainer.value ? false : (activeElement.value && sidebarContainerRef.value) ? !sidebarContainerRef.value?.contains(activeElement.value) : false);
</script>

<template>
  <div class="w-screen flex">
    <div
      ref="sidebarContainerRef"
      @mouseenter="hoveredContainer = true"
      @mouseleave="hoveredContainer = false"
    >
      <slot name="sidebar" :compact-sidebar="compactSidebar" />
    </div>
    <div
      class="ml-2 shrink grow flex-basis-0 overflow-y-auto"
    >
      <slot :compact-sidebar="compactSidebar" />
    </div>
  </div>
</template>
