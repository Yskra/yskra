/** @import {Module} from '@/modules/Public' */

import { EVENT_LOG_MESSAGE } from '@/modules/logger/constants.js';
import { addEntry, entries, groups } from '@/modules/logger/store.js';
import { addSettingsRootPage } from '@/modules/settings';

/**
 * Log and store messages
 * @type {Module}
 * @docs ''
 */
export function createLoggerModule({ isRecoveryMode, awaitModules }) {
  window.addEventListener(EVENT_LOG_MESSAGE, ({ detail, timeStamp }) => {
    if (!detail.meta || !detail.level || !detail.message) {
      return;
    }
    const timestamp = performance.timeOrigin + timeStamp;

    addEntry(detail.meta, detail.level, timestamp, detail.message);
  });

  return {
    displayName: 'Logger',

    install() {
      if (isRecoveryMode.value) {
        return;
      }

      awaitModules('SettingsModule').then(() => {
        // @unocss-include
        addSettingsRootPage({
          name: 'logs',
          path: 'logs',
          component: () => import('@/modules/logger/ui/SettingsLoggerPage.vue'),
          meta: {
            title: 'logs',
            icon: 'i-mingcute:message-4-line',
          },
        });
      });
    },

    global: import.meta.env.DEV ? ({ logs: { entries, groups } }) : ({}),
  };
}

export { Logger } from './Logger.js';
