<script setup lang="ts">
import type { UINotification } from '../Public';
import { storeToRefs } from 'pinia';
import { onMounted } from 'vue';
import { useUIKitConfigStore } from '@/plugins/UiKit/libConfig';

const props = defineProps<UINotification>();
const emit = defineEmits<(e: 'timeout') => void>();

const { config } = storeToRefs(useUIKitConfigStore());

onMounted(() => {
  setTimeout(() => {
    emit('timeout');
  }, props.timeout ?? config.value.notifications.timeout);
});
</script>

<template>
  <div class="w-100 rounded bg-base-300 p-5 pt-3">
    <h2 class="text-lg font-bold">
      {{ contentTitle }}
    </h2>
    <p class="text-sm">
      {{ contentText }}
    </p>
  </div>
</template>

