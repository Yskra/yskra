/** @import {App} from 'vue' */

import { createArrowNavigation } from 'vue-arrow-navigation';
import Logger from '@/utils/Logger';

/**
 * @param {App} app app
 */
export function createNavigation(app) {
  const logger = new Logger('UI/ArrowNavigation');
  const an = createArrowNavigation({
    logger,
  });

  // @ts-ignore
  app.use(an);

  return () => {
    // @ts-ignore
    an.uninstall(app);
  };
}
