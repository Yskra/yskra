import process from 'node:process';
import nested from 'postcss-nested';
import env from 'postcss-preset-env';

import uiKitConfig from './src/plugins/UiKit/buildConfigs/postcss.config.js';

const isProd = process.env.NODE_ENV === 'production';

// noinspection JSUnusedGlobalSymbols
export default {
  plugins: [
    nested(),
    ...uiKitConfig.plugins,

    isProd && env({
      features: {
        'has-pseudo-class': false,
        'focus-visible-pseudo-class': false,
      },
    }),
  ],
};
