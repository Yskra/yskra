<script setup lang="ts">
import DialogLayout from './dialog-layout';

export interface Props {
  title?: string;
}
defineOptions({
  registerIgnore: true,
});
defineProps<Props>();
const show = defineModel('show', { type: Boolean });
</script>

<template>
  <DialogLayout v-model:show="show">
    <Transition name="content">
      <div
        v-if="show"
        class="y-drawer bg-base-200"
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
  @apply absolute right-0 top-0 h-100vh min-w-170 overflow-y-auto rounded-bl-2xl rounded-tl-2xl p-8;
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
