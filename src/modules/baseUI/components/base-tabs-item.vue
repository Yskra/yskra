<script setup lang="ts">
import type { TabsApi } from './base-tabs.vue';
import { computed, getCurrentInstance, inject, mergeProps, onMounted, useAttrs } from 'vue';
import { TABS_INJECT_KEY } from './base-tabs.vue';

defineOptions({
  inheritAttrs: false,
  registerIgnore: true,
});
const props = defineProps<{
  label?: string;
}>();


const instance = getCurrentInstance();
const attrs = useAttrs();
const key: PropertyKey = instance!.vnode.key!;
const tabApi = inject<TabsApi>(TABS_INJECT_KEY)!;
const active = computed<boolean>(() => tabApi.value.activeTabKey === key);

const bind = computed(() => mergeProps(attrs, {
  modifier: [(active.value ? 'active' : null)],
}));

// todo IDK maybe use emit to parent. like registered tab and parent will auto select first tab
onMounted(() => {
  if (tabApi.value.activeTabKey === undefined) {
    tabApi.value.onTabSelect(key);
  }
});
</script>

<template>
  <component
    v-bind="bind"
    is="button"
    v-if="tabApi.mode === 'tab'"
    role="tab"
    class="tab"
    :class="{ active }"
    @click="tabApi.onTabSelect(key)"
  >
    <slot name="tab">
      {{ props.label }}
    </slot>
  </component>

  <KeepAlive>
    <slot v-if="tabApi.mode === 'content' && active" name="default" />
  </KeepAlive>
</template>

<style scoped>
.tab {
  @apply inline-flex flex-wrap cursor-pointer select-none items-center justify-center px-4 text-center border-b-transparent border-b-2 pb-2;
}
.active {
  @apply border-white;
}
</style>
