<script setup lang="ts">
import { computed, provide, ref } from 'vue';
import { injectKey } from '@/plugins/webPlayer/ui/multi-menu/injectKey';

const menus = ref<string[]>(['root']);
const currentSelection = computed(() => menus.value.at(-1));
const prevSelection = computed(() => menus.value.at(-2));
const isForward = ref(true);

provide(injectKey, {
  openSelection,
  closeCurrentSelection,
  currentSelection,
  prevSelection,
  isForward,
});

function openSelection(id: string) {
  menus.value.push(id);
  isForward.value = true;
}
function closeCurrentSelection() {
  menus.value.pop();
  isForward.value = false;
}
</script>

<template>
  <div class="relative h-80vh overflow-x-hidden">
    <slot />
  </div>
</template>
