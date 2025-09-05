/** @import {Module} from '@/modules/Public' */

import parseUserAgent from 'parse-ua';
import { version as vueVersion } from 'vue';
import { version } from '@/../package.json';
import { Logger } from '@/modules/logger';


/**
 * Expose platform information to global
 * @type {Module}
 */
export function createPlatformModule() {
  const logger = new Logger('Platform');
  const platform = parseUserAgent(navigator.userAgent);


  if (import.meta.env.PROD) {
    logger.info(`App version: ${version}, Vue version: ${vueVersion}`);

    logger.info(`UserAgent: ${navigator.userAgent}`);
    logger.info(`Browser: ${platform.browser} v${platform.version}`);
    logger.info(`OS: ${platform.os.family} v${platform.os.version}`);
    logger.info(`Resolution: ${window.screen.width}x${window.screen.height}`);

    // chrome 63+
    logger.info(`Memory: ${'deviceMemory' in navigator ? navigator.deviceMemory : 0}GB`);

    // chrome 37+
    logger.info(`CPUs: ${'hardwareConcurrency' in navigator ? navigator.hardwareConcurrency : 1}`);

    logger.info(`Type: ${platform.type}`);
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
