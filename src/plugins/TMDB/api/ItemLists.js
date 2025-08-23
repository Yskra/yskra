/** @import {ItemListsResponse, ListsPath} from '../Public'; */
/** @import {MaybeRefOrGetter, Ref} from 'vue' */

import { computed, toRef } from 'vue';
import { useTMDBStore } from '@/plugins/TMDB/api/tmdb.js';
import { imageQualities, imageTypes } from '@/plugins/TMDB/constants.js';
import { useUrlBuild } from '@/plugins/TMDB/utils/urlBuild.js';

/** @type {ItemListsResponse} */
const initialData = {
  results: [],
  page: 0,
  total_pages: 0,
  total_results: 0,
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

  const { buildTMDBImageUrl } = useUrlBuild();
  const store = useTMDBStore();
  const url = computed(() => `${type.value}/${path.value}`);
  /** @type {{data: Ref<ItemListsResponse>, error: Ref<any>, isFetching: Ref<boolean>}} */
  // @ts-ignore
  const { data: response, error, isFetching: isLoading } = store.fetch(url, { initialData }).get().json();
  const items = computed(() => response.value.results.map(({ title, name, id, poster_path, release_date, first_air_date, backdrop_path, vote_average }) => ({
    title: title || name,
    id,
    backdropImage: buildTMDBImageUrl(backdrop_path, imageTypes.BACKDROP, [null, imageQualities.AVERAGE]).href,
    voteAverage: vote_average,
    releaseDate: (release_date || first_air_date) ? new Date(release_date || first_air_date) : undefined,
    image: buildTMDBImageUrl(poster_path, imageTypes.POSTER).href,
    link: { name: 'TMDBItem', params: { type: type.value, id } },
  })));

  return {
    error,
    isLoading,
    items,
  };
}
