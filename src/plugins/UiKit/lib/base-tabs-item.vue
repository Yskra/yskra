<script setup lang="ts">
import type { TabsApi } from './base-tabs';
import type { DaisyUIType } from '@/plugins/UiKit/Public';
import { computed, getCurrentInstance, inject, mergeProps, onMounted, useAttrs } from 'vue';
import { TABS_INJECT_KEY } from './base-tabs';
import { DaisyUI, type2array } from './index';

defineOptions({
  inheritAttrs: false,
});
const props = defineProps<{
  label?: string;
  modifier?: DaisyUIType;
}>();

const modifiers = Object.freeze({
  active: 'tab-active', // Makes a single tab look active
  disabled: 'tab-disabled', // Makes a single tab look disabled
});
const instance = getCurrentInstance();
const attrs = useAttrs();
const key: PropertyKey = instance!.vnode.key!;
const tabApi = inject<TabsApi>(TABS_INJECT_KEY)!;
const modifier = computed(() => type2array(props.modifier));
const active = computed<boolean>(() => tabApi.value.activeTabKey === key);

const bind = computed(() => mergeProps(attrs, {
  modifier: [...modifier.value, (active.value ? 'active' : null)],
}));

// todo IDK maybe use emit to parent. like registered tab and parent will auto select first tab
onMounted(() => {
  if (tabApi.value.activeTabKey === undefined) {
    tabApi.value.onTabSelect(key);
  }
});
</script>

<template>
  <DaisyUI
    v-bind="bind"
    is="button"
    v-if="tabApi.mode === 'tab'"
    v-focus
    class="tab"
    :modifiers="modifiers"
    disabled-class="tab-disabled"
    role="tab"
    @click="tabApi.onTabSelect(key)"
  >
    <slot name="tab">
      {{ props.label }}
    </slot>
  </DaisyUI>

  <KeepAlive>
    <slot v-if="tabApi.mode === 'content' && active" name="default" />
  </KeepAlive>
</template>

<style>
.tab:focus {
  @apply focus-cursor;
}
</style>
