import { reactive, readonly } from 'vue';
/** @import {RouteRecordRaw} from 'vue-router'; */
import { useVanillaRouter } from '@/modules/router';
import { SETTINGS_PAGES_PARENT } from '@/modules/settings/route.js';

/** @type {string[]} */
const _rootPages = reactive([]);

export const rootPages = readonly(_rootPages);

/**
 * @param {RouteRecordRaw} route route
 */
export function addSettingsRootPage(route) {
  // @ts-ignore
  _rootPages.push(route.name);
  addPage(route);
}

/**
 * @param {RouteRecordRaw} route route
 */
export function addSettingsPluginPage(route) {
  const router = useVanillaRouter();

  addPage(route);

  router.isReady()
    .then(() => {
      if (router.resolve(router.currentRoute.value).matched.length) {
        // noinspection JSIgnoredPromiseFromCall
        router.replace(router.currentRoute.value);
      }
    })
    .catch((err) => {
      if (err.type !== 1 /* ErrorTypes.MATCHER_NOT_FOUND */) {
        throw err;
      }
    });
}

/**
 * @param {RouteRecordRaw} route route
 */
function addPage(route) {
  const router = useVanillaRouter();

  router.addRoute(SETTINGS_PAGES_PARENT, route);
}
