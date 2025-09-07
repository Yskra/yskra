/** @import {VNode} from 'vue' */
import { defineComponent, h } from 'vue';

export { default as AppLink } from './app-link.vue';
export { default as BackgroundImageLayout } from './background-image-layout.vue';
export { default as BaseButton } from './base-button.vue';
export { default as BaseCard } from './base-card.vue';
export { default as BaseMenuItem } from './base-menu-item.vue';
export { default as BaseSelectItem } from './base-select-item.vue';
export { default as BaseSelect } from './base-select.vue';
export { default as BaseTabsItem } from './base-tabs-item.vue';
export { default as BaseTabs } from './base-tabs.vue';
export { default as BaseTooltip } from './base-tooltip.vue';
export { default as SidebarLayout } from './sidebar-layout.vue';
export { default as YConfirm } from './y-confirm.vue';
export { default as YDrawer } from './y-drawer.vue';
export { default as YModal } from './y-modal.vue';
export { default as YNotification } from './y-notification.vue';
export { default as YPrompt } from './y-prompt.vue';

export const Icon = h(BaseWrap);
export const BaseBadge = h(BaseWrap);
export const BaseMenu = h(BaseWrap, { is: 'ul' });
export const BaseDivider = h(BaseWrap);
export const BaseSlider = getVanillaInput('range');
export const BaseInput = getVanillaInput('text');


/**
 * @param {string} type
 */
function getVanillaInput(type) {
  return defineComponent((props, ctx) => {
    return () => h('input', {
      type,
      value: props.modelValue || props.value,
      onInput: (/** @type {{ target: HTMLInputElement }} */ event) => ctx.emit('update:modelValue', event.target.value),
    });
  }, {
    props: ['value', 'modelValue'],
    emits: ['update:modelValue'],
  });
}

/**
 * @param {{ is: string; }} props
 * @param {{ slots: { default?: () => any; }; }} ctx
 * @return {VNode}
 */
function BaseWrap(props, ctx) {
  const is = props.is ?? 'div';

  return h(() => h(is, null, ctx.slots?.default?.() ?? null));
}
