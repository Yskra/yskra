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
import { computed, defineComponent, h, provide, ref, toRef, useAttrs } from 'vue';
import { DaisyUI, type2array } from './index';

/**
 * @docs https://daisyui.com/components/tab/
 * @example
 * <BaseTabs>
 *   <BaseTabsItem label="Tab 1">Content 1</BaseTabsItem>
 *   <BaseTabsItem label="Tab 2">Content 2</BaseTabsItem>
 *   <BaseTabsItem label="Tab 3">Content 3</BaseTabsItem>
 * </BaseTabs>
 */


defineOptions({
  inheritAttrs: false,
});
const emit = defineEmits<{
  (e: 'selected', tab: PropertyKey): void;
}>();

const styles: Record<string, string> = Object.freeze({
  box: 'tabs-box', // box style
  border: 'tabs-border', // bottom border style
  lift: 'tabs-lift', // lift style
});

const sizes = Object.freeze({
  xs: 'tabs-xs', // Tiny size
  sm: 'tabs-sm', // Small size
  md: 'tabs-md', // Medium size (default)
  lg: 'tabs-lg', // Large size
  xl: 'tabs-xl', // Extra large size
});

const placements = Object.freeze({
  top: 'tabs-top', // Puts tab buttons on top of the tab-content (default)
  bottom: 'tabs-bottom', // Puts tabs on under the tab-content
});

const attrs = useAttrs();
const styling = computed(() => type2array(attrs.styling).map((v: string) => `_${styles[v]}`));
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
    v-focus-section
    class="tabs-component-container h-full w-full"
    :class="styling"
    :data-active-tab="activeTabKey"
  >
    <DaisyUI
      is="div"
      role="tablist"
      :styles="styles"
      :sizes="sizes"
      :placements="placements"
      class="tabs"
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
    </DaisyUI>
  </div>
</template>

<style scoped>
.tabs-component-container {
  :deep(.tab-content) {
    display: block;
  }

  .tabs-list {
    @apply flex overflow-x-auto p-3;

    > * {
      @apply shrink-0;
    }
  }

  &[data-active-tab="0"] :deep(.tab-content) {
    border-start-start-radius: 0;
  }

  &._tabs-border :deep(.tab-content) {
    --tabcontent-margin: calc(-1*var(--border)) 0 0 0;
    --tabcontent-radius-ss: 0;
    --tabcontent-radius-se: var(--radius-box);
    --tabcontent-radius-es: var(--radius-box);
    --tabcontent-radius-ee: var(--radius-box);
  }
}
</style>
