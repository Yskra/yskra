/** @import {Config} from '@/modules/Public'; */

import { computedWithControl } from '@vueuse/core';
import { computed, toRef, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useAppBus } from '@/modules/appBus/index.js';
import { Logger } from '@/modules/logger/index.js';
import { useVanillaRouter } from '@/modules/router/index.js';

/** @type {ReturnType<typeof createUISettings>} */
let instance;

/**
 * @return {ReturnType<typeof createUISettings>}
 */
export function useUISettings() {
  return instance;
}

/**
 * @param {Config} config app config
 */
export function createUISettings(config) {
  const logger = new Logger('Settings/UI');
  const router = useVanillaRouter();
  const bus = useAppBus();
  const fontSize = toRef(config.value.ui, 'fontSize');
  const indexPage = toRef(config.value.ui, 'indexPage');

  const isIndexPageResolved = computedWithControl(indexPage, resolveIndexRoute);
  const indexPageRoute = computed(() =>
    isIndexPageResolved.value ? router.resolve({ name: indexPage.value }) : null,
  );

  watch(fontSize, () => {
    applyFontSize();
  }, { immediate: true });

  // noinspection JSUnusedGlobalSymbols
  const userSettings = {
    indexPage,
    indexPageRoute,
    fontSize,
  };

  bus.on('pluginManager.plugin:mounted', () => {
    if (!isIndexPageResolved.value) {
      isIndexPageResolved.trigger();
    }
  });
  bus.on('pluginManager.plugin:unmounted', () => {
    if (isIndexPageResolved.value) {
      isIndexPageResolved.trigger();
    }
  });

  instance = userSettings;
  return userSettings;


  function resolveIndexRoute() {
    const { t } = useI18n();

    try {
      router.resolve({ name: indexPage.value });

      logger.info(t('Resolved {name} as home page', { name: indexPage.value }));
      return true;
    }
    catch (_) {
      return false;
    }
  }

  function applyFontSize() {
    if (config.value.ui.fontSize > 1) {
      document.documentElement.style.setProperty('font-size', `${config.value.ui.fontSize}px`);
    }
    else {
      document.documentElement.style.removeProperty('font-size');
    }
  }
}
