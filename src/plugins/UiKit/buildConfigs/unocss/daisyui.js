import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { presetDaisy } from '@ameinhardt/unocss-preset-daisy';
import theme from 'daisyui/functions/variables.js';
import { defineConfig } from 'unocss';

const preflightPath = resolve(import.meta.dirname, './daisy-preflight.css');

// noinspection SpellCheckingInspection
export default defineConfig({
  safelist: buildSafelist(),
  separators: [':'],
  theme: { ...theme },
  extendTheme: (theme) => {
    theme.fontSize.xs[0] = 'var(--text-size-xs)';
    theme.fontSize.sm[0] = 'var(--text-size-sm)';
    theme.fontSize.base[0] = 'var(--text-size-base)';
    theme.fontSize.lg[0] = 'var(--text-size-lg)';
    theme.fontSize.xl[0] = 'var(--text-size-xl)';
    // theme.fontSize['2xl'][0] = 'var(--text-size-2xl)';
  },
  presets: [
    presetDaisy({
      themes: ['dark --prefersdark  --default'],
    }),
  ],
  preflights: [
    { layer: 'default', getCSS: () => readFile(preflightPath, 'utf8') },
  ],
});

function buildSafelist() {
  const VARIANTS = [
    'bg-{COLOR_NAME}',
    'text-{COLOR_NAME}',
    'border-{COLOR_NAME}',
    'from-{COLOR_NAME}',
    'via-{COLOR_NAME}',
    'to-{COLOR_NAME}',
    'ring-{COLOR_NAME}',
    'fill-{COLOR_NAME}',
    'caret-{COLOR_NAME}',
    'stroke-{COLOR_NAME}',
    'divide-{COLOR_NAME}',
    'accent-{COLOR_NAME}',
    'shadow-{COLOR_NAME}',
    'outline-{COLOR_NAME}',
    'decoration-{COLOR_NAME}',
    'placeholder-{COLOR_NAME}',
    'ring-offset-{COLOR_NAME}',
  ];

  const COLOR_NAMES = [
    'primary',
    'primary-content',
    'secondary',
    'secondary-content',
    'accent',
    'accent-content',
    'neutral',
    'neutral-content',
    'base-100',
    'base-200',
    'base-300',
    'base-content',
    'info',
    'info-content',
    'success',
    'success-content',
    'warning',
    'warning-content',
    'error',
    'error-content',
  ];

  return VARIANTS.flatMap((variant) => {
    // noinspection RegExpRedundantEscape
    const prefix = variant.replace(/\{COLOR_NAME\}$/, '');

    return COLOR_NAMES.map((color) => `${prefix}${color}`);
  });
}
