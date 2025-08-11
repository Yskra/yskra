/** @import {Module} from '@/modules/Public' */

import { useVanillaRouter } from '@/modules/router';
import { createPlayerSettings } from '@/modules/settings/preferences/player';
import { createUISettings } from '@/modules/settings/preferences/UI';
import route from './route.js';

export { addSettingsPluginPage, addSettingsRootPage } from './addPage.js';
export { usePlayerSettings } from './preferences/player';
export { useUISettings } from './preferences/UI';
export { SETTINGS_PAGES_PARENT } from './route.js';

/**
 * @type {Module}
 * @docs ''
 */
export function createSettingsModule({ config, isRecoveryMode, awaitModules }) {
  return {
    displayName: 'SettingsModule',

    install() {
      const router = useVanillaRouter();

      if (isRecoveryMode.value) {
        return;
      }

      router.addRoute(route);

      awaitModules('PlatformModule', 'Store').then(() => {
        createUISettings(config);
        createPlayerSettings(config);
      });
    },
  };
}
