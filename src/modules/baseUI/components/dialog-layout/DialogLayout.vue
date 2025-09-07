<script setup lang="ts">
import { onKeyStroke } from '@vueuse/core';
import { computed, nextTick, ref, useTemplateRef, watch } from 'vue';
import { useDialogsStore } from './store';

// The layout for manage all popup elements

defineOptions({
  registerIgnore: true,
});
const props = withDefaults(defineProps<{
  leaveDuration?: number;
  targetRef?: HTMLElement | undefined;
}>(), {
  leaveDuration: 100,
});

const store = useDialogsStore();
const show = defineModel<boolean>('show');
const id = ref();
const isActive = computed(() => store.activeDialog === id.value);
const returnFocus = ref<HTMLElement | undefined>();
const containerRef = useTemplateRef<HTMLDivElement>('containerRef');

watch(show, (value) => {
  if (value) {
    id.value = store.open();
  }
  else {
    store.close(id.value);
    id.value = undefined;

    if (returnFocus.value) {
      nextTick(() => {
        returnFocus.value = undefined;
      });
    }
  }
});


onKeyStroke('Escape', close);


function close(event?: unknown) {
  if (isActive.value) {
    show.value = false;

    if (event instanceof Event) {
      event.preventDefault();
    }
  }
}

function forceClose() {
  show.value = false;
  store.close(id.value);
}
</script>

<template>
  <Transition name="dialog-backdrop" :duration="{ leave: props.leaveDuration, enter: 100 }">
    <Teleport to="body">
      <div
        :class="{ 'pointer-events-none': !isActive }"
        class="dialog-backdrop"
      >
        <div v-if="isActive" class="pointer-events-none absolute left-0 top-0 h-full w-full bg-#0006" />

        <div class="dialog-container" @click.self="show = false">
          <div
            ref="containerRef"
            :class="{ 'bg-#0006': !isActive }"
            class="cursor-default"
          >
            <slot />
          </div>
        </div>
      </div>
    </Teleport>
  </Transition>
</template>

<style scoped>
/*noinspection CssUnusedSymbol*/
.dialog-backdrop {
  @apply fixed left-0 top-0 h-screen w-screen;

  .dialog-container {
    @apply relative h-full cursor-pointer overflow-hidden
  }

  &-enter-active, &-leave-active {
    transition: opacity 100ms linear;
  }

  &-enter-from, &-leave-to {
    opacity: 0;
  }
}
</style>
