import { resolve } from 'node:path';
import { defineConfig } from 'vite';

export default defineConfig({
  resolve: {
    alias: {
      'vue/package.json': resolve('node_modules/vue/package.json'),
      'vue': resolve(__dirname, '../wrapVue.js'),
      'npm:vue': resolve('node_modules/vue'),
    },
  },
});
