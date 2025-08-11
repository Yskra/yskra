/** @import {UseFetchOptions, UseFetchReturn} from '@vueuse/core'; */
/** @import {SearchResponse, ItemMovieResponse, ItemTVResponse, ItemPersonResponse, SearchResultItem} from '../Public'; */
/** @import {MaybeRefOrGetter, Ref} from 'vue' */

import { computed, toRef } from 'vue';
import { useTMDBStore } from '@/plugins/TMDB/api/tmdb.js';
import { imageQualities, imageTypes } from '../constants';
import { useUrlBuild } from '../utils/urlBuild';

/**
 * @docs https://developer.themoviedb.org/reference/search-movie
 * @param {MaybeRefOrGetter<string>} type type
 * @param {MaybeRefOrGetter<string>} queryStr queryStr
 */
export function useCollectSearch(type, queryStr) {
  type = toRef(type);
  queryStr = toRef(queryStr);

  const store = useTMDBStore();
  const url = computed(() => `search/${type.value}?query=${queryStr.value}`);
  /** @type {{data: Ref<SearchResponse|null>}} */
  const { data } = store.fetch(url.value).get().json();
  const items = computed(() => data.value ? data.value.results : []);

  return {
    data,
    items,
  };
}

/**
 * Get raw useFetch response with no reactive url
 * @docs https://developer.themoviedb.org/reference/search-movie
 * @param {string} type type of item
 * @param {string} queryStr queryStr
 * @param {UseFetchOptions=} fetchOptions fetchOptions
 * @returns {UseFetchReturn<SearchResultItem[]> & PromiseLike<UseFetchReturn<SearchResultItem[]>>} response
 */
export function useFetchSearch(type, queryStr, fetchOptions = {}) {
  const store = useTMDBStore();

  return store.fetch(`search/${type}?query=${queryStr}`, { ...buildDataByType(type), ...fetchOptions })
    .get()
    .json();
}

/**
 * @param {string} type type of item
 * @returns {UseFetchOptions} * options
 */
function buildDataByType(type) {
  const { buildTMDBImageUrl } = useUrlBuild();

  return {
    afterFetch: (ctx) => {
      if (ctx.data) {
        if (ctx.data.results.length) {
          ctx.data = ctx.data.results.map((/** @type {any} */ item) => {
            if (type === 'movie') {
              return buildMovie(item);
            }
            if (type === 'tv') {
              return buildTv(item);
            }
            if (type === 'person') {
              return buildPerson(item);
            }

            return item;
          });
        }
        else {
          ctx.data = null;
        }
      }
      return ctx;
    },
  };

  /**
   * @param {ItemMovieResponse} data data
   * @returns {SearchResultItem} result
   */
  function buildMovie(data) {
    return {
      ...data,
      title: data.title,
      image: buildTMDBImageUrl(data.poster_path, imageTypes.POSTER, [imageQualities.HIGH, null]).href,
      backdropImage: buildTMDBImageUrl(data.backdrop_path, imageTypes.BACKDROP, [null, imageQualities.AVERAGE]).href,
      releaseDate: data.release_date ? new Date(data.release_date) : undefined,
      link: { name: 'TMDBItem', params: { type: 'movie', id: data.id } },
    };
  }

  /**
   * @param {ItemTVResponse} data data
   * @returns {SearchResultItem} result
   */
  function buildTv(data) {
    return {
      ...data,
      title: data.name,
      image: buildTMDBImageUrl(data.poster_path, imageTypes.POSTER, [imageQualities.HIGH, null]).href,
      backdropImage: buildTMDBImageUrl(data.backdrop_path, imageTypes.BACKDROP, [null, imageQualities.AVERAGE]).href,
      releaseDate: data.first_air_date ? new Date(data.first_air_date) : undefined,
      link: { name: 'TMDBItem', params: { type: 'tv', id: data.id } },
    };
  }

  /**
   * @param {ItemPersonResponse} data data
   * @returns {SearchResultItem} result
   */
  function buildPerson(data) {
    return {
      ...data,
      title: data.name,
      image: buildTMDBImageUrl(data.profile_path, imageTypes.PROFILE, [imageQualities.HIGH, null]).href,
      link: { name: 'TMDBItem', params: { type: 'person', id: data.id } },
    };
  }
}
