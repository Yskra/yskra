/** @import {ComputedRef, Ref} from 'vue'; */
/** @import {Config} from '../Public'; */
/** @typedef {ComputedRef<string>} ComputedString */
/** @typedef {(import('vue-i18n').I18n<any, any, any, any, true>)['global']} I18n */

import { createFetch } from '@vueuse/core';
import { acceptHMRUpdate, defineStore } from 'pinia';
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';

import { codes } from '../languages.js';

/** @type {Ref<Config>} */
const config = ref({
  apiUrl: '',
  imageCdn: '',
  language: '',
  region: '',
  apiTimeout: 8000,
  token: '',
});

export const useTMDBStore = defineStore('tmdb.main', () => {
  /** @type {Ref<string|URL>} */
  const altApiEndpoint = ref('');
  /** @type {Ref<string|URL>} */
  const altImageCdnEndpoint = ref('');

  /** @type {I18n} */
  // @ts-expect-error vue-i18n not provide 'legacy' version generic for this function
  const i18n = useI18n();

  const apiUrl = computed(() => new URL(altApiEndpoint.value || config.value.apiUrl));
  const imageCdn = computed(() => new URL(altImageCdnEndpoint.value || config.value.imageCdn));
  const language = computed(() => {
    if (config.value.language === '') {
      const appLanguage = i18n.locale.split('-').at(0);

      if (appLanguage && codes.includes(appLanguage)) {
        return appLanguage;
      }
    }
    return config.value.language;
  });
  const region = computed(() => {
    if (config.value.region === '') {
      const appRegion = i18n.locale.split('-').at(1);

      if (appRegion) {
        return appRegion;
      }
    }
    return config.value.region;
  });

  const myFetch = createFetch({
    baseUrl: () => apiUrl.value.href,
    options: {
      // @ts-expect-error not valid type in vueuse
      timeout: () => config.value.apiTimeout,
      beforeFetch({ options, url }) {
        const newUrl = new URL(url);

        // @ts-ignore
        options.headers.Authorization = `Bearer ${config.value.token}`;
        newUrl.searchParams.set('language', language.value);
        newUrl.searchParams.set('region', region.value);

        return {
          options,
          url: newUrl.href,
        };
      },
    },
    fetchOptions: {
      method: 'GET',
    },
  });

  return {
    setConfig: (/** @type {Config} */v) => {
      config.value = v;
    },
    altApiEndpoint,
    altImageCdnEndpoint,
    apiUrl,
    imageCdn,
    language,
    region,
    fetch: myFetch,
  };
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useTMDBStore, import.meta.hot));
}
