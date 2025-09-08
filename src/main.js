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
  const { errors, isFatal } = createErrorShield();

  main().catch((error) => {
    // If some error occurred before mounting the main application we get here, obviously.
    console.error('[FATAL 💀]', error);
    isFatal.value = true;
    errors.add(error);
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

/**
 * Handle errors that are not caught by the application. And create overlay with errors.
 */
function createErrorShield() {
  /** @type {Set<Error>} */
  const errors = shallowReactive(new Set());
  const isFatal = shallowRef(false);
  const localStorage = window.localStorage;

  catchTopErrors((err) => {
    errors.add(err);
    console.error(err);
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

  return {
    errors,
    isFatal,
  };
}

/**
 * Catch all errors that were not caught in the application and were able to get to the very top context.
 * The user will immediately see, instead of opening the console.
 * @param {(err: Error) => void} handler
 */
function catchTopErrors(handler) {
  // catch all sync errors
  window.addEventListener('error', (event) => {
    event.preventDefault();
    handler(event.error);
  });
  // catch all async errors
  window.addEventListener('unhandledrejection', (event) => {
    event.preventDefault();
    handler(event.reason instanceof Error ? event.reason : new Error(event.reason));
  });
  // catch vite fails to load dynamic imports
  // The user will see this error if they configure their web-server poorly
  window.addEventListener('vite:preloadError', (event) => {
    event.preventDefault();

    event.payload.message = `${event.payload.message}. See https://vite.dev/guide/build.html#load-error-handling`;
    handler(event.payload);
  });
}
