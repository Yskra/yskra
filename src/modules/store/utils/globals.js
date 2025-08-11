// @ts-nocheck
import { Logger } from '@/modules/logger/index.js';

export function catchPiniaLogger() {
  const defaultConsoleLog = window.console.log;
  const piniaLogger = new Logger('Store');

  /**
   * @param {any[]} data some log data
   */
  function newConsoleLog(...data) {
    if (typeof data[0] === 'string' && data[0].startsWith('🍍')) {
      piniaLogger.info(...data);
      return;
    }
    return defaultConsoleLog(...data);
  }

  delete window.console.log;

  Object.defineProperty(window.console, 'log', {
    value: newConsoleLog,
    writable: true,
    configurable: true,
  });
}
