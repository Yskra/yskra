/* eslint-disable vue/multi-word-component-names */
// @ts-nocheck

import { computed, defineComponent, h } from 'vue';
import { Logger } from '@/modules/logger/index.js';

const imports = import.meta.glob('./*.vue', {
  import: 'default',
  eager: true,
});
const icons = computed(() => Object.fromEntries(
  Object.entries(imports).map(([fileName, module]) => [
    pascal2KebabCase(fileName)
      .replace(/^\.\//, '') // remove leading ./
      .replace(/\.\w+$/, ''), // remove extension
    module,
  ]),
));

/**
 * unocss.presetIcons cannot provide animation of icons through css rules,
 * this is a simple reversal of local icons through a single component (like @iconify/vue, but locally)
 */
export const Icon = defineComponent(
  (props) => {
    const logger = new Logger('Icon');
    const component = computed(() => icons.value[props.name]);

    if (!component.value) {
      logger.error(`Icon ${props.name} not found`);
      logger.info(`All icons: ${Object.keys(icons.value).join(', ')}`);
    }

    return () => h(component.value);
  },
  {
    name: 'Icon',
    props: {
      /** @type {import('vue').PropOptions<string>} */
      name: { type: String, required: true },
    },
  },
);

function pascal2KebabCase(str) {
  return str.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
}
