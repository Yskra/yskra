<script setup lang="ts">
import { inject } from 'vue';
import { injectKey } from '@/plugins/webPlayer/ui/multi-menu/injectKey';

const props = defineProps<{
  openId?: string;
}>();

const multiMenu = inject<{ openSelection: (id: string) => void }>(injectKey);

function onClick() {
  if (props.openId && multiMenu) {
    multiMenu.openSelection(props.openId);
  }
}
</script>

<template>
  <BaseMenuItem @click="onClick">
    <slot />
  </BaseMenuItem>
</template>
