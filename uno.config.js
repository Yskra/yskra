import transformerDirectives from '@unocss/transformer-directives';
import { defineConfig, mergeConfigs, presetIcons, presetWind3 } from 'unocss';

import uiKitConfig from './src/plugins/UiKit/buildConfigs/uno.config.js';

const rootConfig = defineConfig({
  presets: [
    presetWind3(),
    presetIcons(),
  ],
  transformers: [
    transformerDirectives(),
  ],
});

// noinspection JSUnusedGlobalSymbols
export default mergeConfigs([rootConfig, uiKitConfig]);
