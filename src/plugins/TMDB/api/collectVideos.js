/** @import {UseFetchOptions} from '@vueuse/core'; */
/** @import {Trailer, Video, VideosResponse} from '../Public'; */
/** @import {MaybeRefOrGetter, Ref} from 'vue' */

import { computed, toRef, watch } from 'vue';
import { useTMDBStore } from '@/plugins/TMDB/api/tmdb.js';
import { useUrlBuild } from '@/plugins/TMDB/utils/urlBuild.js';
import { VIDEOS_ALT_LANGUAGE } from '../constants.js';

/**
 * @docs https://developer.themoviedb.org/reference/movie-videos
 * @param {MaybeRefOrGetter<string>} type type of item
 * @param {MaybeRefOrGetter<number>} id id of item
 */
export function collectVideos(type, id) {
  type = toRef(type);
  id = toRef(id);

  const { buildYTUrl, buildYTImageUrl } = useUrlBuild();
  const mainStore = useTMDBStore();
  const url = computed(() => `${type.value}/${id.value}/videos`);

  /** @type {{data: Ref<VideosResponse|null>, isFetching: import('vue').Ref<boolean>}} */
  const { data, isFetching } = mainStore.fetch(url.value).get().json();
  /** @type {{data: Ref<VideosResponse|null>, execute: () => void}} */
  const { data: altData, execute } = mainStore.fetch(url.value, { ...fetchOptsWithLang(VIDEOS_ALT_LANGUAGE), immediate: false }).get().json();

  const trailers = computed(() => filterTrailers(data.value?.results));
  const altTrailers = computed(() => filterTrailers(altData.value?.results));

  const wrappedTrailers = computed(() => wrapTrailers(trailers.value));
  const wrappedAltTrailers = computed(() => wrapTrailers(altTrailers.value));

  watch(() => mainStore.language, (value) => {
    if (value !== VIDEOS_ALT_LANGUAGE) {
      // noinspection JSIgnoredPromiseFromCall
      execute();
    }
  }, { immediate: true });

  return {
    data,
    isLoading: isFetching,
    trailers: wrappedTrailers,
    altTrailers: wrappedAltTrailers,
  };

  /**
   * @param {Trailer[]} trailers trailers
   */
  function wrapTrailers(trailers) {
    return trailers.map((e) => ({
      ...e,
      image: e.site === 'YouTube' ? buildYTImageUrl(e.key) : null,
      url: e.site === 'YouTube' ? buildYTUrl(e.key) : null,
      date: new Date(e.published_at),
    }));
  }
}

/**
 * @param {string} lang lang
 * @return {UseFetchOptions} *
 */
function fetchOptsWithLang(lang) {
  return {
    beforeFetch: ({ options, url }) => {
      const newUrl = new URL(url);

      newUrl.searchParams.set('language', lang);
      return { options, url: newUrl.toString() };
    },
  };
}

/**
 * @param {Video[]|undefined} arr arr
 * @return {Trailer[]} trailers
 */
function filterTrailers(arr) {
  // @ts-expect-error ts not knowing about filter ?
  return !arr ? [] : arr.filter((e) => e.type === 'Trailer');
}
