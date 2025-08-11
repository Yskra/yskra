<script setup lang="ts">
import { DialogLayout } from '.';
// Component for creating a popup in the center of the display

const show = defineModel('show', { type: Boolean });
</script>

<template>
  <DialogLayout v-model:show="show">
    <Transition name="content">
      <div
        v-if="show"
        v-focus-section.autofocus
        class="y-dialog"
      >
        <slot :close="() => show = false" />
      </div>
    </Transition>
  </DialogLayout>
</template>

<style scoped>
.y-dialog {
  @apply absolute left-50% top-20% bg-base-100 p-5 rounded-box -translate-x-50% -translate-y-20%;
}

/*noinspection CssUnusedSymbol*/
.content {
  &-enter-active, &-leave-active {
    transition: transform 200ms linear, opacity .1s linear;
  }

  &-enter-from, &-leave-to {
    transform: translate(-50%, -150%);
    opacity: 0;
  }
}
</style>
