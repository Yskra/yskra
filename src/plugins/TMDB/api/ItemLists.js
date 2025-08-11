/** @import {ItemListsResponse, ListsPath} from '../Public'; */
/** @import {MaybeRefOrGetter, Ref} from 'vue' */

import { computed, ref, toRef, watch } from 'vue';
import { useTMDBStore } from '@/plugins/TMDB/api/tmdb.js';
import { imageQualities, imageTypes } from '@/plugins/TMDB/constants.js';
import { useUrlBuild } from '@/plugins/TMDB/utils/urlBuild.js';

/** @type {ItemListsResponse} */
const initialData = {
  results: [],
};

/**
 * @template {'movie' | 'tv'} T
 * @docs https://developer.themoviedb.org/reference/tv-series-airing-today-list
 * @docs https://developer.themoviedb.org/reference/movie-now-playing-list
 * @param {MaybeRefOrGetter<T>} typeR *
 * @param {MaybeRefOrGetter<ListsPath<T>>} pathR url path api
 */
export function useCollectLists(typeR, pathR) {
  const type = toRef(typeR);
  const path = toRef(pathR);

  let abortController = new AbortController();
  const isLoading = ref(false);
  const { buildTMDBImageUrl } = useUrlBuild();
  const store = useTMDBStore();
  const url = computed(() => `${type.value}/${path.value}`);
  // @ts-ignore
  /** @type {Ref<ItemListsResponse>} */
  const response = ref(initialData);
  const items = computed(() => response.value.results.map(({ title, name, id, poster_path, release_date, first_air_date, backdrop_path, vote_average }) => ({
    title: title || name,
    id,
    backdropImage: buildTMDBImageUrl(backdrop_path, imageTypes.BACKDROP, [null, imageQualities.AVERAGE]).href,
    voteAverage: vote_average,
    releaseDate: (release_date || first_air_date) ? new Date(release_date || first_air_date) : undefined,
    image: buildTMDBImageUrl(poster_path, imageTypes.POSTER).href,
    link: { name: 'TMDBItem', params: { type: type.value, id } },
  })));

  watch([url, () => store.language], async () => {
    // cancel the leading request, sometimes the application localization file loads faster -
    // which triggers a change of the active language in the application,
    // and the downloading of the default language data has not yet been completed and then the default language data can rewrite more current data
    abortController?.abort();
    abortController = new AbortController();

    await refresh();
  }, { immediate: true });

  return {
    items,
  };

  async function refresh() {
    isLoading.value = true;
    response.value = initialData;

    if (url.value) {
      const { data } = await store.fetch(url.value).get().json();

      response.value = data.value;
    }
    isLoading.value = false;
  }
}
