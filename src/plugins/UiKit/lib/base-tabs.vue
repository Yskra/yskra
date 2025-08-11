<script setup lang="ts">
import type { VNode } from 'vue';
import { eachChild } from '@skirtle/vue-vnode-utils';
import { computed, h, ref, useAttrs, useSlots } from 'vue';
import { DaisyUI, type2array } from '.';

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
  (e: 'selected', tab: VNode): void;
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
const slots = useSlots();
const activeTabKey = ref<PropertyKey>();

function RenderTabs({ mode }: { mode: 'tab' | 'content' }) {
  const rendered = slots.default?.() ?? [];

  eachChild(rendered, (child) => {
    const tabIndex: PropertyKey = child.key!;

    if (!activeTabKey.value) {
      activeTabKey.value = tabIndex;
    }

    if (!child.props) {
      child.props = {};
    }

    child.props.mode = mode;
    child.props.onClick = () => onActivateTab(tabIndex, child);
    child.props.active = tabIndex === activeTabKey.value;
  });
  return h(() => rendered);
}

function onActivateTab(key: PropertyKey, child: VNode) {
  activeTabKey.value = key;
  emit('selected', child);
}
</script>

<template>
  <div
    class="tabs-component-container h-full w-full"
    :class="styling"
    :data-active-tab="activeTabKey"
  >
    <KeepAlive>
      <DaisyUI
        is="div"
        role="tablist"
        :styles="styles"
        :sizes="sizes"
        :placements="placements"
        class="tabs"
        v-bind="$attrs"
      >
        <RenderTabs mode="tab" />


        <RenderTabs mode="content" />
      </DaisyUI>
    </KeepAlive>
  </div>
</template>

<style scoped>
.tabs-component-container {
  :deep(.tab-content) {
    display: block;
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
