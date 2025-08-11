import { resolve } from 'node:path';
import { defineConfig } from 'vite';

export default defineConfig({
  resolve: {
    alias: {
      'vue-i18n/package.json': resolve('node_modules/vue-i18n/package.json'),
      'vue-i18n': resolve(__dirname, '../fixedVueI18n.js'),
      'npm:vue-i18n': resolve('node_modules/vue-i18n'),
    },
  },
});
