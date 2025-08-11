<script setup lang="ts">
import type { DaisyUIType } from '@/plugins/UiKit/Public';
import { computed, mergeProps, toRef, useAttrs } from 'vue';
import { DaisyUI, type2array } from '.';

defineOptions({
  inheritAttrs: false,
});
const { active = false, ...props } = defineProps<{
  label?: string;
  modifier?: DaisyUIType;
  active?: boolean;
  mode?: 'tab' | 'content';
}>();

const attrs = toRef(() => useAttrs());
const modifiers = Object.freeze({
  active: 'tab-active', // Makes a single tab look active
  disabled: 'tab-disabled', // Makes a single tab look disabled
});
const modifier = computed(() => type2array(props.modifier));

const bind = computed(() => mergeProps(attrs.value, {
  modifier: [...modifier.value, (active ? 'active' : null)],
}));
</script>

<template>
  <DaisyUI
    v-bind="bind"
    is="button"
    v-if="mode === 'tab'"
    v-focus
    class="tab"
    :modifiers="modifiers"
    disabled-class="tab-disabled"
    role="tab"
  >
    <slot name="tab">
      {{ props.label }}
    </slot>
  </DaisyUI>

  <slot v-if="props.mode === 'content' && active" name="default" />
</template>

<style>
.tab:focus {
  @apply focus-cursor;
}
</style>
