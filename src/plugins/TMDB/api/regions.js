/** @import {CountiesResponse} from '../Public'; */

import { acceptHMRUpdate, defineStore } from 'pinia';
import { computed, watch } from 'vue';
import { useTMDBStore } from '@/plugins/TMDB/api/tmdb.js';

/**
 * @docs https://developer.themoviedb.org/reference/watch-providers-available-regions
 */
export const useRegionsStore = defineStore('tmdb.regions', () => {
  const mainStore = useTMDBStore();
  /** @type {{data: import('vue').Ref<CountiesResponse|null>, execute: () => void}} */
  const { data: response, execute } = mainStore.fetch('watch/providers/regions').get().json();
  const regions = computed(() => Object.fromEntries(
    response.value ? response.value.results.map(({ iso_3166_1, native_name }) => [iso_3166_1, native_name]) : [],
  ));

  watch(() => mainStore.language, () => {
    // noinspection JSIgnoredPromiseFromCall
    execute();
  });

  return {
    response,
    regions,
  };
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useRegionsStore, import.meta.hot));
}
