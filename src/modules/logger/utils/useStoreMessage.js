/** @import {EntryLevel} from '@/modules/logger/Public'; */

import { EVENT_LOG_MESSAGE } from '../constants';

/**
 * @param {string} prefix
 * @param {string} color
 * @param {string} context
 * @return {(level: EntryLevel, ...message: any) => void}
 */
export default function useStoreMessage(prefix, color, context) {
  const meta = { prefix, context, color };

  return function (level, ...message) {
    if (message.every((/** @type {any} */ m) => !m)) {
      return;
    }

    window.dispatchEvent(new CustomEvent(EVENT_LOG_MESSAGE, {
      detail: { meta, message, level },
    }));
  };
}
