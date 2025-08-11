import scrollbar from 'postcss-scrollbar';
import resolveColorMixVars from './postcss/resolve-color-mix-vars.js';
import themeFix from './postcss/theme-fix.js';
import wherePseudo from './postcss/where-pseudo.js';


const colorVarAliases = Object.freeze({
  'color-base-100_0_0_0_40': 'color-base-100-40alpha',
  'color-base-content_20_transparent': 'color-base-content-20alpha',
  'color-base-content_40_transparent': 'color-base-content-40alpha',
  'color-black_30_transparent': 'color-black-lighter',
  'color-black-lighter_depth_100_transparent': 'color-black-lighter',
  'color-black_30_transparent_0_transparent': 'color-black-more-lighter',
  'color-base-content_50_transparent': 'color-base-content-40alpha',
  'color-neutral_transparent': 'color-neutral-lighter',
  'color-primary_90_black': 'color-primary-10darker',
  'color-primary_80_black': 'color-primary-20darker',
  'color-secondary_80_black': 'color-secondary-20darker',
  'color-accent_80_black': 'color-accent-20darker',
  'color-neutral_80_black': 'color-neutral-20darker',
  'color-success_80_black': 'color-success-20darker',
  'color-info_80_black': 'color-info-20darker',
  'color-warning_80_black': 'color-warning-20darker',
  'color-error_80_black': 'color-error-20darker',
});

export default {
  plugins: [
    scrollbar(),
    wherePseudo(),
    themeFix(),
    resolveColorMixVars(colorVarAliases),
  ],
};
