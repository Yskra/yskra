/** @import {SearchProvider, SearchResult} from '../Public'; */

import { useEventListener } from '@vueuse/core';
import { acceptHMRUpdate, defineStore } from 'pinia';
import { markRaw, reactive } from 'vue';
import { SEARCH_TIMEOUT } from '@/plugins/search/constants.js';

export const useProvidersStore = defineStore('search.providers', () => {
  /** @type {SearchProvider[]} */
  const providers = reactive([]);

  return {
    searchAll,

    providers,
    addProvider,
    removeProvider,
  };

  /**
   * @param {SearchProvider} provider
   * @return {() => void} remove search provider
   */
  function addProvider(provider) {
    if (providers.find((e) => e.name === provider.name)) {
      throw new Error(`Provider ${provider.name} already registered`);
    }
    providers.push(markRaw(provider));

    return () => removeProvider(provider);
  }

  /**
   * @param {SearchProvider} provider
   */
  function removeProvider(provider) {
    const i = providers.findIndex((e) => e.name === provider.name);

    if (i !== -1) {
      providers.splice(i, 1);
    }
  }

  /**
   * @param {string} query
   * @param {{signal?: AbortSignal}=} options
   * @return {Promise<{[k: string]: SearchResult[] | Error}>}
   */
  async function searchAll(query, options = { signal: (new AbortSignal()) }) {
    const resultByProvider = providers.map((p) => makeRequest(p, options));
    const resultEntries = await Promise.all(resultByProvider);

    return Object.fromEntries(resultEntries);

    /**
     * @param {SearchProvider} provider
     * @param {{signal?: AbortSignal}} options
     * @return {Promise<[string, SearchResult[] | Error]>}
     */
    async function makeRequest(provider, options) {
      let searchResult;

      try {
        searchResult = provider.search(query);
      }
      // @ts-ignore
      catch (/** @type {Error} */ err) {
        return [provider.name, err];
      }

      useEventListener(options.signal, 'abort', searchResult.abort);
      setTimeout(searchResult.abort, SEARCH_TIMEOUT);

      const { data, error } = await searchResult;

      return [provider.name, error ?? data ?? []];
    }
  }
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useProvidersStore, import.meta.hot));
}
