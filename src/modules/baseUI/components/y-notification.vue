<script setup lang="ts">
import type { Component } from 'vue';
import { onMounted } from 'vue';

export interface UINotification {
  contentTitle?: string;
  contentText: string;
  icon?: string | Component | 'success' | 'error' | 'info';
  timeout?: number;
}

defineOptions({
  registerIgnore: true,
});
const props = defineProps<UINotification>();
const emit = defineEmits<(e: 'timeout') => void>();

onMounted(() => {
  setTimeout(() => {
    emit('timeout');
    // todo tmp
  }, props.timeout ?? 10_000);
});
</script>

<template>
  <div class="notification">
    <h2 class="text-lg font-bold">
      {{ contentTitle }}
    </h2>
    <p class="text-sm">
      {{ contentText }}
    </p>
  </div>
</template>

<style scoped>
.notification {
  @apply w-100 rounded bg-base-300 p-5 pt-3;
}
</style>

