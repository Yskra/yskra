// noinspection JSIgnoredPromiseFromCall
/** @import {Module} from '@/modules/Public' */
/** @typedef {import('vue-i18n').I18n<any, any, any, any, true>} I18n */

import { watch } from 'vue';
import { createI18n } from 'vue-i18n';
import { Logger } from '@/modules/logger';
import createManualThenable from '@/utils/thenable.js';
import { CODES, FALLBACK_LOCALE, locales, manifest } from './locales.js';
import ruPluralization from './pluralization/ru.js';

/** @type {I18n} */
let instance;
/** @type {(language: string) => Promise<void>} */
let setLanguage;

/**
 * @return {I18n & {manifest: manifest, setLanguage: setLanguage}}
 */
export function useI18n() {
  return {
    setLanguage,
    manifest,
    ...instance,
  };
}

/**
 * Manage internationalization of the application
 * @type {Module}
 * @docs https://vue-i18n.intlify.dev/api/general.html
 */
export function createI18nModule({ config }) {
  /**
   * instance.global.availableLocales - unreliable source of truth
   * @type {CODES[0][]}
   */
  const availableLocales = [];
  const language = config.value.language || window.navigator.language;
  const logger = new Logger('i18n');
  const ready = createManualThenable();

  instance = createI18n({
    fallbackLocale: FALLBACK_LOCALE,
    formatFallbackMessages: true,
    silentTranslationWarn: true,
    pluralizationRules: {
      'ru-RU': ruPluralization,
    },

    // enabled by default, 'false' is break formatFallbackMessages, need block updates for vue-118n from v10
    legacy: true,
  });
  setLanguage = setLanguageFn;

  watch(() => config.value.language, (value) => {
    setLanguage(value);
  }, { immediate: true });

  if (language !== FALLBACK_LOCALE) {
    loadLocale(FALLBACK_LOCALE);
  }

  return {
    displayName: 'I18nModule',

    install(app) {
      app.use(instance);
    },
    isReady: Promise.resolve(ready.thenable),
  };

  /**
   * @param {string} language *
   * @return {Promise<void>}
   */
  async function setLanguageFn(language) {
    if (!CODES.includes(language)) {
      return;
    }

    await loadLocale(language);
    instance.global.locale = language;
    config.value.language = language;
    document.querySelector('html')?.setAttribute('lang', language.split('-').at(0) || '');
  }

  /**
   * @param {CODES[0]} locale *
   */
  async function loadLocale(locale) {
    if (!availableLocales.includes(locale)) {
      const messages = await locales.value[locale]();

      instance.global.mergeLocaleMessage(locale, messages);

      logger.info(instance.global.t('Locale {name} is loaded', { name: locale }));
      availableLocales.push(locale);
    }

    ready.resolve(); // any local loaded = ready
  }
}
