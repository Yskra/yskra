/** @import {DiscoverResponse, AllowedDiscoverQuery} from '../Public'; */
/** @import {MaybeRefOrGetter, Ref} from 'vue' */

import { computed, ref, toRef, watch } from 'vue';
import { useTMDBStore } from '@/plugins/TMDB/api/tmdb.js';
import { imageQualities, imageTypes } from '@/plugins/TMDB/constants.js';
import { useUrlBuild } from '@/plugins/TMDB/utils/urlBuild.js';

/** @type {DiscoverResponse} */
const initialData = {
  results: [],
  page: 0,
  total_pages: 0,
  total_results: 0,
};

/**
 * @template {'movie' | 'tv'} T
 * @docs https://developer.themoviedb.org/reference/discover-movie
 * @param {MaybeRefOrGetter<T>} typeR type of Discover
 * @param {MaybeRefOrGetter<AllowedDiscoverQuery<T>>} queryR query
 */
export function useCollectDiscover(typeR, queryR = {}) {
  const type = toRef(typeR);
  const query = toRef(queryR);

  let abortController = new AbortController();
  const isLoading = ref(false);
  const { buildTMDBImageUrl } = useUrlBuild();
  const store = useTMDBStore();
  const searchParams = computed(() => Object.entries(query.value).map(([k, v]) => `${k}=${v}`).join('&'));
  const url = computed(() => `discover/${type.value}?${searchParams.value}`);
  /** @type {Ref<DiscoverResponse>} */
  const response = ref(initialData);
  const items = computed(() => response.value.results.map(({ title, name, id, poster_path, release_date, backdrop_path, vote_average }) => ({
    title: title ?? name,
    id,
    backdropImage: buildTMDBImageUrl(backdrop_path, imageTypes.BACKDROP, [null, imageQualities.AVERAGE]).href,
    voteAverage: vote_average,
    releaseDate: release_date ? new Date(release_date) : undefined,
    image: buildTMDBImageUrl(poster_path, imageTypes.POSTER).href,
    link: { name: 'TMDBItem', params: { type: type.value, id } },
  })));
  const page = computed(() => response.value.page);
  const totalPages = computed(() => response.value.total_pages);

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
    page,
    totalPages,
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
