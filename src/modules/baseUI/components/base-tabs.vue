<script lang="ts">
import type { Ref } from 'vue';

export const TABS_INJECT_KEY = Symbol('tabs key');

export type TabsApi = Readonly<Ref<{
  activeTabKey: PropertyKey | undefined;
  onTabSelect: (key: PropertyKey) => void;
  mode: 'tab' | 'content';
}>>;
</script>

<script setup lang="ts">
import { defineComponent, h, provide, ref, toRef } from 'vue';

defineOptions({
  inheritAttrs: false,
  registerIgnore: true,
});
const emit = defineEmits<{
  (e: 'selected', tab: PropertyKey): void;
}>();
/**
 * @example
 * <BaseTabs>
 *   <BaseTabsItem label="Tab 1">Content 1</BaseTabsItem>
 *   <BaseTabsItem label="Tab 2">Content 2</BaseTabsItem>
 *   <BaseTabsItem label="Tab 3">Content 3</BaseTabsItem>
 * </BaseTabs>
 */


const activeTabKey = ref<PropertyKey>();

function onActivateTab(key: PropertyKey) {
  activeTabKey.value = key;
  emit('selected', key);
}

const InjectWrap = defineComponent<{ mode: 'tab' | 'content' }, any, any, any>((props, ctx) => {
  provide<TabsApi>(TABS_INJECT_KEY, toRef(() => ({
    mode: props.mode,
    activeTabKey: activeTabKey.value,
    onTabSelect: onActivateTab,
  })));

  return () => h(ctx.slots.default);
}, {
  props: ['mode'],
  slots: ['default'],
});
</script>

<template>
  <div
    class="tabs-component-container"
    :data-active-tab="activeTabKey"
  >
    <component
      is="div"
      role="tablist"
      v-bind="$attrs"
    >
      <div class="tabs-list">
        <InjectWrap mode="tab">
          <slot />
        </InjectWrap>
      </div>


      <InjectWrap mode="content">
        <slot />
      </InjectWrap>
    </component>
  </div>
</template>

<style scoped>
.tabs-component-container {
  @apply h-full w-full;

  :deep(.tab-content) {
    display: block;
  }

  .tabs-list {
    @apply flex overflow-x-hidden p-3;

    > * {
      @apply shrink-0;
    }
  }
}
</style>
