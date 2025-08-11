// noinspection SpellCheckingInspection
/** @import {WatchProvider, WatchProvidersResponse} from '../Public'; */
/** @import {MaybeRefOrGetter, Ref, ComputedRef} from 'vue' */

import { computed, toRef, watch } from 'vue';
import { useTMDBStore } from '@/plugins/TMDB/api/tmdb.js';
import { useJustWatchStore } from '@/plugins/TMDB/api/watchProvidersRegions.js';
import { imageTypes } from '@/plugins/TMDB/constants.js';
import { useUrlBuild } from '../utils/urlBuild.js';

const initialData = {
  flatrate: [],
  rent: [],
  buy: [],
};

/**
 * @docs https://developer.themoviedb.org/reference/movie-watch-providers
 * @param {MaybeRefOrGetter<string>} type type of item
 * @param {MaybeRefOrGetter<number>} id id of item
 */
export function useCollectWatchProvider(type, id) {
  type = toRef(type);
  id = toRef(id);

  const { buildTMDBImageUrl } = useUrlBuild();
  const mainStore = useTMDBStore();
  const store = useJustWatchStore();
  const url = computed(() => `${type.value}/${id.value}/watch/providers`);
  const { data, isFetching } = mainStore.fetch(url.value).get().json();

  const filteredData = computed(() => data.value ? data.value.results[store.filterRegion] : initialData);
  const watchProviders = computed(() => ({
    link: filteredData.value.link,
    flatrate: filteredData.value.flatrate ? fixImages(filteredData.value.flatrate) : undefined,
    rent: filteredData.value.rent ? fixImages(filteredData.value.rent) : undefined,
    buy: filteredData.value.buy ? fixImages(filteredData.value.buy) : undefined,
  }));
  const availableRegions = computed(() => Object.keys(data.value?.results || {}).map((e) => ({ value: e, label: store.regions[e] })));

  watch(data, (value) => {
    if (value?.results) {
      const hasSelectedRegion = availableRegions.value.find((e) => e.value === store.filterRegion);

      if (hasSelectedRegion) {
        return;
      }
      const hasUserRegion = availableRegions.value.find((e) => e.value === mainStore.region);

      if (hasUserRegion) {
        store.filterRegion = mainStore.region;
        return;
      }

      store.filterRegion = Object.keys(value.results)[0];
    }
  });

  return {
    availableRegions,
    watchProviders,
    isLoading: isFetching,
  };

  /**
   * @param {WatchProvider[]} arr arr
   */
  function fixImages(arr) {
    return arr.map((e) => ({ ...e, logo: buildTMDBImageUrl(e.logo_path, imageTypes.LOGO) }));
  }
}
