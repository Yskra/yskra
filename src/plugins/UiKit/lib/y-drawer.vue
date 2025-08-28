<script setup lang="ts">
// import { ChangeFocusCause, Direction, onBeforeANSectionLeave } from 'vue-arrow-navigation';

export interface Props {
  title?: string;
}
defineProps<Props>();

const show = defineModel('show', { type: Boolean });

// onBeforeANSectionLeave((from) => {
//   if (show.value && from.cause === ChangeFocusCause.KEYDOWN && from.direction === Direction.LEFT) {
//     show.value = false;
//   }
// });
</script>

<template>
  <DialogLayout v-model:show="show">
    <Transition name="content">
      <div
        v-if="show"
        class="y-drawer"
      >
        <slot name="title">
          <h2 v-if="title" class="text-lg font-bold">
            {{ title }}
          </h2>
        </slot>

        <BaseDivider />

        <slot />
      </div>
    </Transition>
  </DialogLayout>
</template>

<style scoped>
.y-drawer {
  @apply absolute right-0 top-0 h-100vh min-w-170 overflow-y-auto border-2 border-l border-base-300 rounded-bl-2xl rounded-tl-2xl bg-base-200 p-8;
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
