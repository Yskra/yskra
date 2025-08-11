/** @import {Logger} from '@/modules/logger'; */
/** @import {PluginUnmount} from '@/modules/pluginManager/managers/mountManager'; */
/** @import {Router, RouteRecordRaw, RouteRecordNameGeneric} from 'vue-router'; */
// noinspection JSCheckFunctionSignatures,JSValidateTypes,JSIgnoredPromiseFromCall

import { useI18n } from 'vue-i18n';
import { ROUTER_PAGES_PARENT, useVanillaRouter } from '@/modules/router';

/**
 * @param {Logger} logger logger
 * @param {PluginUnmount} unmountPlugin unmount plugin util
 * @returns {Router} wrapped router
 */
export function createPluginRouter(logger, unmountPlugin) {
  const router = useVanillaRouter();
  const { t } = useI18n();

  /** @type {RouteRecordRaw[]} */
  const matcher = [];

  // noinspection JSUnusedGlobalSymbols
  const routerWrapper = {
    ...router,
    /**
     * @param {NonNullable<RouteRecordNameGeneric>|RouteRecordRaw} parentOrRoute parent
     * @param {RouteRecordRaw=} route route
     */
    addRoute: (parentOrRoute, route) => {
      /** @type {RouteRecordRaw} */
      let record;
      /** @type {NonNullable<RouteRecordNameGeneric>} */
      let parent;

      if (isRouteName(parentOrRoute)) {
        // @ts-ignore
        record = route;
        parent = parentOrRoute;
      }
      else {
        record = parentOrRoute;
      }

      if (!record.name) {
        logger.error(t('Provide name of the router record {path}', { path: record.path }));
        return () => undefined;
      }

      matcher.push(record);
      // @ts-ignore
      router.addRoute(parent ?? (record.path.startsWith('/') ? record : ROUTER_PAGES_PARENT), record);
      logger.info(t('Route {name} registered', { name: record.name }));

      router.isReady()
        .then(() => {
          if (router.resolve(router.currentRoute.value).matched.length) {
            router.replace(router.currentRoute.value);
          }
        })
        .catch((err) => {
          // @ts-ignore
          if (err.type !== 1 /* ErrorTypes.MATCHER_NOT_FOUND */) {
            throw err;
          }
        });

      return () => undefined;
    },
    /**
     * @param {NonNullable<RouteRecordNameGeneric>} recordName record name
     */
    removeRoute: (recordName) => {
      const record = matcher.find((r) => r.name === recordName);

      if (!record) {
        return;
      }
      matcher.splice(matcher.indexOf(record), 1);

      router.removeRoute(recordName);
      logger.info(t('Route {name} removed', { name: recordName }));

      return () => undefined;
    },
  };

  unmountPlugin.step(() => {
    [...matcher].forEach(({ name }) => {
      if (name) {
        routerWrapper.removeRoute(name);
      }
    });
  });

  return routerWrapper;

  /**
   * @param {unknown} name router
   * @returns {name is string | symbol} name is router name
   */
  function isRouteName(name) {
    return typeof name === 'string' || typeof name === 'symbol';
  }
}
