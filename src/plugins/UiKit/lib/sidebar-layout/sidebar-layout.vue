<script setup lang="ts">
import { useActiveElement } from '@vueuse/core';
import { computed, onUnmounted, ref, useTemplateRef } from 'vue';

const sidebarContainerRef = useTemplateRef<HTMLElement>('sidebarContainerRef');
const activeElement = useActiveElement();

const hoveredContainer = ref(false);
const compactSidebar = computed(() => hoveredContainer.value ? false : (activeElement.value && sidebarContainerRef.value) ? !sidebarContainerRef.value?.contains(activeElement.value) : false);
let hoverTimeout: NodeJS.Timeout | undefined;

onUnmounted(() => {
  clearTimeout(hoverTimeout);
});

function onMouseEnter() {
  if (hoverTimeout) {
    clearTimeout(hoverTimeout);
    hoverTimeout = undefined;
  }
  hoveredContainer.value = true;
}

function onMouseLeave() {
  hoverTimeout = setTimeout(() => {
    hoveredContainer.value = false;
  }, 500);
}
</script>

<template>
  <div class="flex">
    <div
      ref="sidebarContainerRef"
      @mouseenter="onMouseEnter"
      @mouseleave="onMouseLeave"
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
