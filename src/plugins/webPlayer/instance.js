/** @import {PlayerRef} from './Public' */
/** @import {App} from 'vue' */

import { createPlayerController } from 'player';
import { hasInjectionContext, inject, ref } from 'vue';
import Logger from '@/utils/Logger.js';
import { INJECT_KEY } from './constants.js';

/** @type {ReturnType<typeof createPlayerController>} */
let instance;


/** @type {PlayerRef} */
// @ts-ignore
export const playerRef = ref(null);

/** @returns {ReturnType<typeof createPlayerController>} player instance */
export function usePlayerInstance() {
  return instance || (hasInjectionContext() && inject(INJECT_KEY));
}

/**
 * Create player instance and provide it to app
 * @param {App} app app instance
 * @returns {ReturnType<typeof createPlayerController>} player instance
 */
export function createPlayerInstance(app) {
  const logger = new Logger('WebPlayer');

  instance = createPlayerController(playerRef, logger);
  app.provide(INJECT_KEY, instance);

  return instance;
}
