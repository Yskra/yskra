<script setup lang="ts">
import type { Ref } from 'vue';
import { computed, inject } from 'vue';
import { injectKey } from '@/plugins/webPlayer/ui/multi-menu/injectKey';
import MultiMenuItem from './MultiMenuItem.vue';

const props = defineProps<{
  id: string;
}>();


const multiMenu = inject<{
  currentSelection: Ref<string>;
  prevSelection: Ref<string>;
  closeCurrentSelection: () => void;
  isForward: Ref<boolean>;
}>(injectKey);

const transition = computed(() => {
  if (!multiMenu) {
    return undefined;
  }

  if (multiMenu.prevSelection.value === props.id && multiMenu.isForward.value) {
    return 'from-left';
  }
  if (multiMenu.isForward.value) {
    return 'to-left';
  }
  return undefined;
});
const isActive = computed(() => multiMenu?.currentSelection.value === props.id);
</script>

<template>
  <Transition :name="transition">
    <div
      v-if="isActive"
      class="absolute w-full"
    >
      <BaseMenu
        :class="$attrs.class"
        class="w-full"
      >
        <slot />

        <MultiMenuItem v-if="id !== 'root'" @click="multiMenu?.closeCurrentSelection">
          <div v-focus class="flex justify-between">
            <div class="flex items-center">
              <Icon name="line-md-chevron-left" class="ml-2 mr-4 h-2em" />
              <span>{{ $t('back') }}</span>
            </div>
          </div>
        </MultiMenuItem>
      </BaseMenu>
    </div>
  </Transition>
</template>

<style scoped>
/*noinspection CssUnusedSymbol*/
.from-left {
  &-enter-active, &-leave-active {
    transition: transform .5s ease-in-out;
  }
  &-enter-from, &-leave-to {
    transform: translateX(-100%);
  }
}
/*noinspection CssUnusedSymbol*/
.to-left {
  &-enter-active, &-leave-active {
    transition: transform .5s ease-in-out, opacity .2s linear;
  }
  &-enter-from, &-leave-to {
    transform: translateX(100%);
    opacity: 0;
  }
}
</style>

