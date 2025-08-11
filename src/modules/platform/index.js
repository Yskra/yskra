/** @import {Module} from '@/modules/Public' */

import { version as vueVersion } from 'vue';
import { version } from '@/../package.json';
import { Logger } from '@/modules/logger';
import parseUserAgent from './parseUserAgent.js';


/**
 * Expose platform information to global
 * @type {Module}
 */
export function createPlatformModule() {
  const logger = new Logger('Platform');
  const platform = parseUserAgent(navigator.userAgent);

  logger.info(`App version: ${version}, Vue version: ${vueVersion}`);

  if (import.meta.env.PROD) {
    logger.info(`UserAgent: ${navigator.userAgent}`);
    logger.info(`Browser: ${platform.browser} v${platform.version}`);
    logger.info(`OS: ${platform.os.family} v${platform.os.version}`);
    logger.info(`isTV: ${platform.isTV}`);
  }

  return {
    displayName: 'PlatformModule',

    install() {},

    global: {
      version,
      platform,
    },
  };
}
