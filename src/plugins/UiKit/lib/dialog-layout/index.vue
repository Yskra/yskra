<script lang="ts">
export { useDialogsStore } from './store';

export default {
  name: 'DialogLayout',
};
</script>

<script setup lang="ts">
import { onKeyStroke } from '@vueuse/core';
import { computed, nextTick, ref, useTemplateRef, watch } from 'vue';
import { defineNAConfig, onBeforeANSectionLeave, useArrowNavigation } from 'vue-arrow-navigation';
import { useRouterResolver } from '..';
import { createRipple } from './ripple';
import { useDialogsStore } from './store';

// The layout for manage all popup elements

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

const targetRefRect = computed(() => props.targetRef?.getBoundingClientRect());
const rippleX = computed(() => (targetRefRect.value?.left || 0) + window.scrollX + (targetRefRect.value?.width || 0) / 2);
const rippleY = computed(() => (targetRefRect.value?.top || 0) + window.scrollY + (targetRefRect.value?.height || 0) / 2);
const Ripple = createRipple(rippleX, rippleY, show, isActive);
const arrowNavigation = useArrowNavigation();

defineNAConfig({
  autofocus: true,
});
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
useRouterResolver(
  () => {
    forceClose();
    return true;
  },
  () => {
    if (isActive.value) {
      close();
      return false;
    }
    return true;
  },
);


onKeyStroke('Escape', close);
onBeforeANSectionLeave((to, from) => {
  if (containerRef.value && (containerRef.value.contains(from.target) && !containerRef.value.contains(to.target)) && isActive.value) {
    return false;
  }
});

function close(event?: unknown) {
  if (isActive.value) {
    show.value = false;
    arrowNavigation.triggerFocusRestore();

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
        <Ripple />

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

.reduce-motion .dialog-backdrop :deep(div) {
  transition: none;
}

@media (prefers-reduced-motion: reduce) {
  .dialog-backdrop :deep(div) {
    transition: none;
  }
}
</style>
