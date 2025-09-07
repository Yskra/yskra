<script lang="ts">
export const SELECT_INJECT_KEY = Symbol('select key');
export interface SelectApi {
  onSelect: (value: unknown) => void;
  multiple: boolean;
}
</script>

<script setup lang="ts">
import { nextTick, provide, ref, shallowReactive, watch } from 'vue';

export interface Props {
  title: string;
  multiple?: boolean;
}
defineOptions({
  inheritAttrs: false,
  registerIgnore: true,
});

const props = withDefaults(defineProps<Props>(), {
  multiple: false,
});

const emit = defineEmits<{
  change: [value: unknown];
  closed: [];
}>();

const show = ref(false);
const dropdownRef = ref<HTMLElement | null>(null);
const triggerRef = ref<HTMLElement | null>(null);
const dropDownTop = ref(0);


watch(show, () => {
  if (!show.value) {
    emit('closed');
  }
});

provide<SelectApi>(SELECT_INJECT_KEY, shallowReactive({
  onSelect,
  multiple: props.multiple,
}));

function onSelect(value: unknown) {
  emit('change', value);

  if (!props.multiple) {
    show.value = false;
  }
}
async function toggle() {
  show.value = !show.value;
  await nextTick();
  calculatePosition();
}

function calculatePosition() {
  if (!dropdownRef.value || !triggerRef.value) {
    return;
  }

  const triggerRect = triggerRef.value.getBoundingClientRect();
  const dropdownHeight = dropdownRef.value.offsetHeight;
  const triggerTop = triggerRect.top;
  const triggerBottom = triggerRect.bottom;
  const topDown = triggerBottom;

  const topUp = triggerTop - dropdownHeight;

  if (window.innerHeight - triggerBottom >= dropdownHeight) {
    dropDownTop.value = topDown + 5;
  }
  else if (triggerTop >= dropdownHeight) {
    dropDownTop.value = topUp;
  }
  else {
    dropDownTop.value = topDown;
  }
}
</script>

<template>
  <button ref="triggerRef" @click="toggle">
    <slot name="open">
      <span class="select-trigger rounded-md">{{ title }}</span>
    </slot>
  </button>

  <div
    v-if="show"
    ref="dropdownRef"
    class="fixed min-w-50"
    :style="{ top: `${dropDownTop}px` }"
  >
    <BaseMenu class="select-dropdown rounded-md bg-base-300">
      <slot />
    </BaseMenu>
  </div>
</template>

<style scoped>
.select-trigger {
  @apply inline-flex border-2 px-2 py-2 text-sm;
}
.select-dropdown {
  @apply border-2  px-2 py-2 text-sm;
}
</style>

