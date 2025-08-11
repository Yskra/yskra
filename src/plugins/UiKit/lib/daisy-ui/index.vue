<script lang="ts">
export { default as type2array } from './type2array.js';

export default {
  name: 'DaisyUI',
};
</script>

<script setup lang="ts">
import type { Component } from 'vue';
import type { DaisyUIType } from '@/plugins/UiKit/Public';
import { computed, getCurrentInstance, nextTick } from 'vue';
import { useI18n } from 'vue-i18n';
import Logger from '@/utils/Logger';
import type2array from './type2array';

// Low level UI component, see Base*.vue components for supported type modifiers

export interface Props {
  is: string | Component;
  disabled?: boolean;
  disabledClass?: string;

  styles?: Record<string, string>;
  colors?: Record<string, string>;
  sizes?: Record<string, string>;
  modifiers?: Record<string, string>;
  directions?: Record<string, string>;
  placements?: Record<string, string>;
  types?: Record<string, string>;

  styling?: DaisyUIType;
  color?: DaisyUIType;
  size?: DaisyUIType;
  modifier?: DaisyUIType;
  direction?: DaisyUIType;
  placement?: DaisyUIType;
  type?: DaisyUIType;
}

const props = defineProps<Props>();
const instance = getCurrentInstance();
const parentName = computed(() => instance?.parent?.type?.__name);
const { t } = useI18n();
const logger = new Logger('UI Kit');

const stylingArray = computed(() => type2array(props.styling));
const colorArray = computed(() => type2array(props.color));
const sizeArray = computed(() => type2array(props.size));
const modifierArray = computed(() => type2array(props.modifier));
const directionArray = computed(() => type2array(props.direction));
const placementArray = computed(() => type2array(props.placement));
const typesArray = computed(() => type2array(props.type));

const classes = computed(() => [
  ...validateAndConvert(props.styles, stylingArray.value, 'styling'),
  ...validateAndConvert(props.colors, colorArray.value, 'color'),
  ...validateAndConvert(props.sizes, sizeArray.value, 'size'),
  ...validateAndConvert(props.modifiers, modifierArray.value, 'modifier'),
  ...validateAndConvert(props.directions, directionArray.value, 'direction'),
  ...validateAndConvert(props.placements, placementArray.value, 'placement'),
  ...validateAndConvert(props.types, typesArray.value, 'type'),
  ...[
    props.disabled ? props.disabledClass : undefined,
  ],
]);
const attrs = computed(() => ({
  class: classes.value,
  disabled: (!props.disabled) ? undefined : '',
}));

function validateAndConvert(dict: Record<string, string> | undefined, arr: string[], type: string): string[] {
  if (!dict) {
    return [];
  }
  return arr
    .map((value) => {
      if (value && !dict[value]) {
        nextTick(() => {
          logger.warn(
            '[DaisyUI]',
            t(`invalidTypeComponent`, { type, value, component: parentName.value }),
            instance?.parent?.vnode?.el,
          );
        });
      }
      return dict[value];
    })
    .filter(Boolean);
}
</script>

<template>
  <component
    :is="props.is"
    v-bind="attrs"
  >
    <slot />
  </component>
</template>
