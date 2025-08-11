/** @import {PluginManifest} from '@/modules/pluginManager/Public'; */
/** @import {Config} from '@/modules/Public'; */

import { toRef } from 'vue';

/**
 * @param {Config} config app config
 */
export function useEnableManager(config) {
  return {
    isPluginDisabled,
    enablePlugin,
    disablePlugin,
    disabledPlugins: toRef(() => config.value.pluginManager.disabled),
  };

  /**
   * Check if plugin is disabled
   * @param {PluginManifest['id']} id id
   */
  function isPluginDisabled(id) {
    return config.value.pluginManager.disabled.includes(id);
  }

  /**
   * Enable plugin if it was disabled
   * @param {PluginManifest['id']} id id
   */
  function enablePlugin(id) {
    if (config.value.pluginManager.disabled.includes(id)) {
      const i = config.value.pluginManager.disabled.indexOf(id);

      config.value.pluginManager.disabled.splice(i, 1);
    }
  }

  /**
   * Disable plugin if it was enabled
   * @param {PluginManifest['id']} id id
   */
  function disablePlugin(id) {
    if (!config.value.pluginManager.disabled.includes(id)) {
      config.value.pluginManager.disabled.push(id);
    }
  }
}
