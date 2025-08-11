/** @import {TrendingResponse} from '../Public'; */
/** @import {MaybeRefOrGetter, Ref} from 'vue' */

import { computed, ref, toRef, watch } from 'vue';
import { useTMDBStore } from '@/plugins/TMDB/api/tmdb.js';
import { imageQualities, imageTypes } from '@/plugins/TMDB/constants.js';
import { useUrlBuild } from '@/plugins/TMDB/utils/urlBuild.js';

const initialData = {
  results: [],
};

/**
 * @docs https://developer.themoviedb.org/reference/trending-all
 * @param {MaybeRefOrGetter<'all' | 'movie' | 'person' | 'tv'>} type type of Trending
 * @param {MaybeRefOrGetter<'day' | 'week'>} timeWindow type of Discover
 */
export function useCollectTrending(type, timeWindow) {
  type = toRef(type);
  timeWindow = toRef(timeWindow);

  let abortController = new AbortController();
  const isLoading = ref(false);
  const { buildTMDBImageUrl } = useUrlBuild();
  const store = useTMDBStore();
  const url = computed(() => `trending/${type.value}/${timeWindow.value}`);
  /** @type {Ref<TrendingResponse>} */
  const response = ref(initialData);
  const items = computed(() => response.value.results.map(({ title, name, id, poster_path, release_date, backdrop_path, vote_average, media_type }) => ({
    title: title ?? name,
    id,
    backdropImage: buildTMDBImageUrl(backdrop_path, imageTypes.BACKDROP, [null, imageQualities.AVERAGE]).href,
    voteAverage: vote_average,
    releaseDate: release_date ? new Date(release_date) : undefined,
    image: buildTMDBImageUrl(poster_path, imageTypes.POSTER).href,
    link: { name: 'TMDBItem', params: { type: media_type, id } },
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
