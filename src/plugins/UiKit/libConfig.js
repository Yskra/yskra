/** @import {FilmCardOrderItem} from './lib/film-card/Public'; */

import { defineStore } from 'pinia';
import { ref } from 'vue';
import { deepToRaw } from '@/utils/deepToRaw.js';

export const useUIKitConfigStore = defineStore('uikit.config', () => {
  const config = ref({
    filmCard: {
      /** @type {FilmCardOrderItem[]} */
      actionsOrder: [],
    },
    notifications: {
      timeout: 10_000,
      maxElements: 4,
    },
  });

  return {
    config,

    init,
  };

  /**
   * @param {(c: typeof config['value']) => typeof config['value']} defineConfig defineConfig from plugin ctx
   */
  function init(defineConfig) {
    config.value = defineConfig(deepToRaw(config.value));
  }
});
