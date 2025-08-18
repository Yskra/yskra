import { fileURLToPath } from 'node:url';
import { defineConfig, mergeConfig } from 'vitest/config';
import viteConfig from './vite.config.js';

// noinspection JSUnusedGlobalSymbols
export default defineConfig(async (env) => mergeConfig(
  await viteConfig(env),
  {
    test: {
      include: ['**/__tests__/*.?(c|m)[jt]s?(x)'],
      environment: 'jsdom',
      root: fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
));
