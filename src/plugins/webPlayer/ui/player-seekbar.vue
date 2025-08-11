<script setup lang="ts">
import { reactiveComputed, useMouse, useMousePressed } from '@vueuse/core';
import { computed, ref, watch } from 'vue';

const props = defineProps<{
  elapsedTime: number;
  bufferTime: number;
  max: number;
}>();
const emit = defineEmits(['setTime']);
const percentage = computed(() => (props.elapsedTime / props.max) * 100);
const percentage2 = computed(() => (props.bufferTime / props.max) * 100);
const seekbarRef = ref<HTMLElement>();
const seekbarRect = reactiveComputed(() => {
  if (seekbarRef.value) {
    const rect = seekbarRef.value.getBoundingClientRect();

    return { y: rect.top, x: rect.left, width: rect.width, height: rect.height };
  }
  return { y: 0, x: 0, width: 0, height: 0 };
});
const showHoverTooltip = ref(false);
const tooltipX = ref(0);
const tooltipPosition = computed(() => ({ y: seekbarRect.y, x: seekbarRect.x + tooltipX.value }));
const tooltipTime = ref(0);
const { x: mouseX } = useMouse();
const { pressed } = useMousePressed({ target: seekbarRef });

watch(pressed, (value) => {
  if (value) {
    handleSeek();
  }
});
watch(mouseX, () => {
  if (pressed.value) {
    handleTooltip();
    handleSeek();
  }
});

function handleTooltip() {
  const posX = mouseX.value - seekbarRect.x;
  const time = posX / seekbarRect.width * props.max;

  tooltipTime.value = time > 0 ? (time >= props.max ? props.max : time) : 0;
  tooltipX.value = posX > 0 ? (posX >= seekbarRect.width ? seekbarRect.width : posX) : 0;
}

function handleSeek() {
  emit('setTime', tooltipTime.value);
}
</script>

<template>
  <div
    ref="seekbarRef"
    v-focus-section
    class="w-full flex items-center"
    @mouseenter="showHoverTooltip = true"
    @mousemove="handleTooltip"
    @mouseleave="pressed ? null : showHoverTooltip = false"
  >
    <div v-focus class="relative z-0 h-1 w-full flex items-center bg-base-300">
      <div class="absolute h-0.5 bg-base-content transition-width" :style="{ width: `${percentage2}%` }" />
      <div class="z-1 h-0.5 bg-primary" :style="{ width: `${percentage}%` }" />
      <div
        class="z-1 h-4 w-4 rounded-full bg-primary"
      />
    </div>

    <div
      v-if="showHoverTooltip"
      class="absolute -translate-50%"
      :style="{ top: `${tooltipPosition.y}px`, left: `${tooltipPosition.x}px` }"
    >
      <slot
        name="hoverTooltip"
        :time="tooltipTime"
      />
    </div>
  </div>
</template>

