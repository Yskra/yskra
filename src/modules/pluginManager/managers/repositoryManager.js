/** @import {Config} from '@/modules/Public'; */

import { toRef } from 'vue';

/**
 * Generally its manager used for settings page
 * @param {Config} config
 */
export function useRepositoryManager(config) {
  return {
    addRepository,
    removeRepository,
    repositories: toRef(() => config.value.pluginManager.repositories),
  };

  /**
   * Add repository to pluginManager config
   * @param {string} repository
   */
  function addRepository(repository) {
    if (!config.value.pluginManager.repositories.includes(repository)) {
      return config.value.pluginManager.repositories.push(repository);
    }
  }

  /**
   * Remove repository from pluginManager config
   * @param {string} repository
   */
  function removeRepository(repository) {
    if (config.value.pluginManager.repositories.includes(repository)) {
      const i = config.value.pluginManager.repositories.indexOf(repository);

      config.value.pluginManager.repositories.splice(i, 1);
    }
  }
}
