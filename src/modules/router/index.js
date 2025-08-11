// noinspection JSIncompatibleTypesComparison
/** @import {Module} from '@/modules/Public' */
/** @import {Router, RouterScrollBehavior} from 'vue-router'; */

import { h } from 'vue';
import { useI18n } from 'vue-i18n';
import { createRouter, createWebHashHistory, createWebHistory, isNavigationFailure, RouterView } from 'vue-router';
import { Logger } from '@/modules/logger';
import route from '@/modules/router/route.js';
import { catchRouterWarn } from './utils/globals.js';

const history2fabric = {
  history: createWebHistory,
  hash: createWebHashHistory,
};

/** @type {Router} */
let router;

export function useVanillaRouter() {
  return router;
}

export { ROUTER_PAGES_PARENT } from './route.js';

/** @type {RouterScrollBehavior} */
function scrollBehavior(_, __, savedPosition) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(savedPosition || { left: 0, top: 0 });
    }, 500);
  });
}

/**
 * @type {Module}
 * @docs https://router.vuejs.org/api/
 */
export function createRouterModule({ config, rootComponents }) {
  const logger = new Logger('Router');
  const mode = config.value.router.mode;
  const baseUrl = config.value.router?.baseUrl ?? import.meta.env.BASE_URL;
  const history = history2fabric[mode] ?? history2fabric.history;

  router = createRouter({
    history: history(baseUrl),
    routes: [route],
    scrollBehavior,
  });

  /** @type {import('vue-router').Router} */
  const publicRouter = {
    ...router,
    addRoute: () => {
      logger.warn(useI18n().t('Use the plugin context to call {method}', { method: 'router.addRoute' }));
      return () => undefined;
    },
    removeRoute: () => {
      logger.warn(useI18n().t('Use the plugin context to call {method}', { method: 'router.removeRoute' }));
      return () => undefined;
    },
  };

  publicRouter.afterEach((to, from, failure) => {
    if (failure && from.name !== undefined && !isNavigationFailure(failure)) {
      logger.error(to, from, failure);
    }
  });

  if (import.meta.env.PROD) {
    catchRouterWarn();
  }

  return {
    displayName: 'Router',

    install(app) {
      rootComponents.add(h(RouterView));
      app.use(publicRouter);
    },
  };
}
