/** @import {TrendingResponse} from '../Public'; */
/** @import {MaybeRefOrGetter, Ref} from 'vue' */

import { computed, toRef } from 'vue';
import { useTMDBStore } from '@/plugins/TMDB/api/tmdb.js';
import { imageQualities, imageTypes } from '@/plugins/TMDB/constants.js';
import { useUrlBuild } from '@/plugins/TMDB/utils/urlBuild.js';

/** @type {TrendingResponse} */
const initialData = {
  results: [],
  page: 0,
  total_pages: 0,
  total_results: 0,
};

/**
 * @docs https://developer.themoviedb.org/reference/trending-all
 * @param {MaybeRefOrGetter<'all' | 'movie' | 'person' | 'tv'>} type type of Trending
 * @param {MaybeRefOrGetter<'day' | 'week'>} timeWindow type of Discover
 */
export function useCollectTrending(type, timeWindow) {
  type = toRef(type);
  timeWindow = toRef(timeWindow);

  const { buildTMDBImageUrl } = useUrlBuild();
  const store = useTMDBStore();
  const url = computed(() => `trending/${type.value}/${timeWindow.value}`);
  /** @type {{data: Ref<TrendingResponse>, error: Ref<any>, isFetching: Ref<boolean>}} */
  // @ts-ignore
  const { data: response, error, isFetching: isLoading } = store.fetch(url, { initialData }).get().json();
  const items = computed(() => response.value.results.map(({ title, name, id, poster_path, release_date, backdrop_path, vote_average, media_type }) => ({
    title: title ?? name,
    id,
    backdropImage: buildTMDBImageUrl(backdrop_path, imageTypes.BACKDROP, [null, imageQualities.AVERAGE]).href,
    voteAverage: vote_average,
    releaseDate: release_date ? new Date(release_date) : undefined,
    image: buildTMDBImageUrl(poster_path, imageTypes.POSTER).href,
    link: { name: 'TMDBItem', params: { type: media_type, id } },
  })));

  return {
    error,
    isLoading,
    items,
  };
}
