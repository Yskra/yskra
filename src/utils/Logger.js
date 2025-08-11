import { Logger as BaseLogger } from '@/modules/logger/Logger.js';

export default class Logger extends BaseLogger {
  /**
   * @param {string} name
   */
  constructor(name) {
    super(name, { text: 'Plugin', color: '#737FFF' });
  }
}
