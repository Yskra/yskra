import { execSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import process from 'node:process';

import legacy from '@vitejs/plugin-legacy';
import vue from '@vitejs/plugin-vue';
import UnoCSS from 'unocss/vite';
import { defineConfig, mergeConfig } from 'vite';

import componentRegisterConfig from './src/modules/componentRegister/buildConfigs/vite.config.js';
import i18nConfig from './src/modules/i18n/buildConfigs/vite.config.js';

const isProd = process.env.NODE_ENV === 'production';
const commitHash = execSync('git rev-parse HEAD').toString();

const modulesConfig = mergeConfig(i18nConfig, componentRegisterConfig);
const rootConfig = defineConfig(async () => /** @type {import('vite').UserConfig} */ ({
  define: {
    __COMMIT_HASH__: JSON.stringify(commitHash),
    __BUILD_DATE__: JSON.stringify(new Date().toISOString()),
  },
  build: {
    minify: true,
  },
  server: {
    port: 8930,
    strictPort: true,
  },
  preview: {
    port: 8080,
  },
  plugins: [
    await devPlugins(),
    vue(),
    UnoCSS(),
    legacy({
      // note: modern is Chrome >= 64 (start support import.meta)
      modernPolyfills: [
        'es.array.flat-map',
        'es.array.flat',
        'es.object.from-entries',
        'es.promise.all-settled',
        'es.array.to-reversed',
        'es.array.at',
        'es.iterator.constructor',
        'es.map.constructor',
        'es.iterator.filter',
        'es.iterator.map',
        'es.array.to-sorted',
        'web.structured-clone',
      ],
    }),
    buildHashPlugin(),
  ],
  resolve: {
    alias: {
      '@': resolve('src'),
      '@lib': resolve('lib'),
      '@localPlugins': isProd ? resolve('public/plugins') : resolve('plugins'),
      '@locales': resolve('locales'),
      '@icon': resolve('src/plugins/UiKit/lib/Icons/index.js'),
      'vue-arrow-navigation': resolve('lib/vue-arrow-navigation'),
      'player': resolve('lib/web-player'),
      'parse-ua': resolve('lib/parse-ua'),
    },
    extensions: ['.js', '.ts', '.vue'],
  },
}));


// noinspection JSUnusedGlobalSymbols
export default defineConfig(async (env) => mergeConfig(
  await rootConfig(env),
  modulesConfig,
));


/** @return {Promise<(import('vite').Plugin | any)[]>} */
async function devPlugins() {
  if (isProd) {
    return [];
  }

  return [
    await import('vite-plugin-vue-devtools').then(({ default: plugin }) => plugin({
      launchEditor: 'webstorm',
    })),
  ];
}

/** @return {import('vite').Plugin} */
function buildHashPlugin() {
  return {
    name: 'vite-plugin-build-hash',
    apply: 'build', // Только для сборки

    generateBundle(options, bundle) {
      const entryFile = Object.values(bundle).find(
        (chunk) => chunk.type === 'chunk' && chunk.isEntry,
      );

      if (!entryFile || !options.dir) {
        return;
      }

      const hash = createHash('sha256')
        // @ts-ignore
        .update(entryFile.code)
        .digest('hex');

      writeFileSync(join(options.dir, 'buildHash.txt'), hash, 'utf-8');
    },
  };
}
