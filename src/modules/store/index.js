/** @import {Module} from '@/modules/Public' */

import { createPinia } from 'pinia';
import { catchPiniaLogger } from './utils/globals.js';

/**
 * Global storage
 * @type {Module}
 * @docs 'https://pinia.vuejs.org/introduction.html'
 */
export function createStore() {
  if (import.meta.env.PROD) {
    catchPiniaLogger();
  }

  return {
    displayName: 'Store',

    install(app) {
      app.use(createPinia());
    },
  };
}
