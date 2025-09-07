<script setup lang="ts">
import type { UseConfirmDialogReturn } from '@vueuse/core';
import YDialog from './y-dialog.vue';

export interface Props {
  text: string;
  controller: UseConfirmDialogReturn<boolean, void, void>;
}
defineOptions({
  registerIgnore: true,
});

const { controller } = defineProps<Props>();

function handleEnter(event: KeyboardEvent) {
  if (controller.isRevealed.value && event.target?.dataset?.isCansel !== 'true') {
    controller.confirm();
  }
}
</script>

<template>
  <YDialog :show="controller.isRevealed.value" @update:show="() => controller.cancel()">
    <div class="y-confirm" @keydown.enter="handleEnter">
      <h2 class="mb-5 text-base">
        {{ $props.text }}
      </h2>
      <div class="flex justify-end">
        <BaseButton
          :data-is-cansel="true"
          class="mx-3 min-w-20"
          @click="controller.cancel"
        >
          {{ $t('cancel') }}
        </BaseButton>
        <BaseButton
          color="primary"
          class="mx-1 min-w-20"
          autofocus
          @click="controller.confirm"
        >
          {{ $t('ok') }}
        </BaseButton>
      </div>
    </div>
  </YDialog>
</template>

<style scoped>
.y-confirm {
  @apply w-120 flex flex-col justify-between;
}
</style>
