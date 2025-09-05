import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';

// noinspection JSUnusedGlobalSymbols
export default defineConfig({
  test: {
    include: ['**/__tests__/*.?(c|m)[jt]s?(x)'],
    root: fileURLToPath(new URL('./src', import.meta.url)),
  },
});
