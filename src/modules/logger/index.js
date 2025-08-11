/** @import {Module} from '@/modules/Public' */

import { addSettingsRootPage } from '@/modules/settings';

/**
 * Log and store messages
 * @type {Module}
 * @docs ''
 */
export function createLoggerModule({ isRecoveryMode }) {
  return {
    displayName: 'Logger',

    install() {
      if (isRecoveryMode.value) {
        return;
      }

      // @unocss-include
      addSettingsRootPage({
        name: 'logs',
        path: 'logs',
        component: () => import('@/modules/logger/pages/SettingsLogger.vue'),
        meta: {
          title: 'logs',
          icon: 'i-mingcute:message-4-line',
        },
      });
    },
  };
}

export { Logger } from './Logger.js';
