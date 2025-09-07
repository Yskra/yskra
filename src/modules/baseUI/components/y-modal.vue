<script setup lang="ts">
import type { Component } from 'vue';
import { resolveComponent } from 'vue';
import YDialog from './y-dialog.vue';

export interface ButtonCtx {
  close: () => void;
  event: Event;
}
export interface Props {
  title?: string;
  buttons?: {
    is?: Component; // default BaseButton
    label: string;
    onClick: (ctx: ButtonCtx) => void;
  }[];
}

defineOptions({
  registerIgnore: true,
});
const props = defineProps<Props>();

const show = defineModel('show', { type: Boolean });

function ModalButton() {
  return props.buttons?.[0]?.is ?? resolveComponent('BaseButton');
}
</script>

<template>
  <YDialog v-model:show="show">
    <template #default="{ close }">
      <div class="y-modal">
        <slot name="title" :close="close">
          <h2 v-if="title" class="my-2 text-lg">
            {{ title }}
          </h2>
        </slot>

        <slot :close="close" />

        <slot name="footer" :close="close">
          <div v-if="buttons" class="flex justify-end">
            <ModalButton
              v-for="button in buttons"
              :key="button.label"
              class="mx-1"
              @click="(event: Event) => button.onClick({ close, event })"
            >
              <label>{{ button.label }}</label>
            </ModalButton>
          </div>
        </slot>
      </div>
    </template>
  </YDialog>
</template>

<style scoped>
.y-modal {
  @apply min-w-50vw flex flex-col justify-between;
}
/*noinspection CssUnusedSymbol*/
.content {
  &-enter-active, &-leave-active {
    transition: transform .1s linear, opacity .1s linear;
  }

  &-enter-from, &-leave-to {
    transform: translateX(50%);
    opacity: 50;
  }
}
</style>
