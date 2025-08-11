/** @import {GenresResponse} from '../Public'; */
// noinspection JSIgnoredPromiseFromCall

import { acceptHMRUpdate, defineStore } from 'pinia';
import { computed, watch } from 'vue';
import { useTMDBStore } from '@/plugins/TMDB/api/tmdb.js';

/**
 * @docs https://developer.themoviedb.org/reference/genre-movie-list
 */
export const useGenresStore = defineStore('tmdb.genres', () => {
  const mainStore = useTMDBStore();
  /** @type {{data: import('vue').Ref<GenresResponse|null>, execute: () => void}} */
  const { data: moviesResp, execute: execute1 } = mainStore.fetch('genre/movie/list').get().json();
  /** @type {{data: import('vue').Ref<GenresResponse|null>, execute: () => void}} */
  const { data: tvResp, execute: execute2 } = mainStore.fetch('genre/tv/list').get().json();

  const movie = computed(() => Object.fromEntries(
    moviesResp.value ? moviesResp.value.genres.map(({ id, name }) => [id, name]) : [],
  ));
  const tv = computed(() => Object.fromEntries(
    tvResp.value ? tvResp.value.genres.map(({ id, name }) => [id, name]) : [],
  ));

  watch(() => mainStore.language, () => {
    execute1();
    execute2();
  });

  return {
    moviesResp,
    tvResp,
    movie,
    tv,
  };
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useGenresStore, import.meta.hot));
}
