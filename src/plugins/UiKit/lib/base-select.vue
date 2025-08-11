<script lang="ts">
export const SELECT_INJECT_KEY = Symbol('select key');
export interface SelectApi {
  onSelect: (value: unknown) => void;
  multiple: boolean;
}
</script>

<script setup lang="ts">
import { provide, ref, shallowReactive, watch } from 'vue';
import { BaseButton, BaseMenu, YDrawer } from '.';

export interface Props {
  title: string;
  multiple?: boolean;
}

defineOptions({
  inheritAttrs: false,
});

const props = withDefaults(defineProps<Props>(), {
  multiple: false,
});

const emit = defineEmits<{
  change: [value: unknown];
  closed: [];
}>();

const show = ref(false);
const targetRef = ref<EventTarget | null>();

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
async function open(event: Event) {
  targetRef.value = event.target;
  show.value = true;
}
</script>

<template>
  <slot name="open" :open="open">
    <BaseButton v-bind="$attrs" @click="open">
      <span>{{ title }}</span>
    </BaseButton>
  </slot>

  <YDrawer v-model:show="show" :target-ref="targetRef">
    <template #title>
      <h2 class="text-lg font-bold">
        {{ title }}
      </h2>
    </template>

    <BaseMenu v-focus-section class="w-full p-0">
      <slot />
    </BaseMenu>
  </YDrawer>
</template>
