/* eslint-disable perfectionist/sort-imports */
/** @import {Config, UserProfiles} from '@/modules/Public'; */
/** @import {VNode} from 'vue'; */

// load unocss to top level, so modules can rewrite styles
import '@unocss/reset/tailwind.css';
import 'virtual:uno.css';
import '@/main.css';

import { CONFIG_FILE_PATH, DEFAULT_PROFILE, FATAL_MOUNT_POINT, LS_CONFIG_KEY, LS_USER_PROFILES_KEY, MOUNT_POINT } from '@/constants.js';
import FatalError from '@/FatalError.vue';
import loadModules from '@/modules';
import deepMerge from '@/utils/deepMerge.js';
import { useFetch, useStorage, watchOnce } from '@vueuse/core';
import { createApp, shallowReactive, shallowRef } from 'vue';

import 'element-closest-polyfill';
import 'abortcontroller-polyfill/dist/polyfill-patch-fetch';


(() => {
  /** @type {Set<Error>} */
  const errors = shallowReactive(new Set());
  const isFatal = shallowRef(false);
  const localStorage = window.localStorage;

  main()
    .catch((error) => {
      // If some error occurred before mounting the main application we get here, obviously.
      console.error('[FATAL 💀]', error);
      isFatal.value = true;
      errors.add(error);
    });

  // catch all sync errors
  window.addEventListener('error', (event) => {
    const error = event.error;

    event.preventDefault();
    console.error(error);
    errors.add(error);
  });
  // catch all async errors
  window.addEventListener('unhandledrejection', (event) => {
    const error = event.reason instanceof Error ? event.reason : new Error(event.reason);

    event.preventDefault();
    console.error(error);
    errors.add(error);
  });
  // catch vite fails to load dynamic imports
  window.addEventListener('vite:preloadError', (event) => {
    const error = event.payload;

    error.message = `${error.message}. See https://vite.dev/guide/build.html#load-error-handling`;

    event.preventDefault();
    console.error(error);
    errors.add(error);
  });

  // create app only once, pass reactive errors to it
  watchOnce(errors, () => {
    const props = {
      errors,
      isFatal: isFatal.value,
      onClose: () => errors.clear(),
      onResetConfig: () => localStorage.removeItem(LS_CONFIG_KEY),
    };

    createApp(FatalError, props)
      .mount(FATAL_MOUNT_POINT);
  });
})();


/**
 * Main app entry point
 */
async function main() {
  /** @type {Set<VNode>} */
  const rootComponents = shallowReactive(new Set());
  const { data: serverConfig, error } = await useFetch(CONFIG_FILE_PATH).get().json();
  const localStorage = window.localStorage;

  if (error.value) {
    throw new Error(`Failed to load ${CONFIG_FILE_PATH}: ${error.value}`);
  }

  /** @type {Config} */
  const config = useStorage(LS_CONFIG_KEY, serverConfig.value, localStorage, { mergeDefaults: (v, defaults) => deepMerge(defaults, v) });

  /** @type {UserProfiles} */
  const userProfiles = useStorage(LS_USER_PROFILES_KEY, [DEFAULT_PROFILE], localStorage);

  createApp(() => [...rootComponents])
    .use(loadModules({ config, userProfiles, rootComponents }))
    .mount(MOUNT_POINT);
}
