/** @import {ItemMovieResponse, ItemTVResponse} from '../Public'; */
/** @import {MaybeRefOrGetter, Ref} from 'vue' */

import { computed, toRef } from 'vue';
import { imageQualities, imageTypes } from '../constants.js';
import findCertification from '../utils/certification.js';
import { useUrlBuild } from '../utils/urlBuild.js';
import { useRegionsStore } from './regions.js';
import { useTMDBStore } from './tmdb.js';

/** @type {ItemMovieResponse | ItemTVResponse & {ids: {}}} */
const initialData = {
  adult: false,
  homepage: '',
  imdb_id: '',
  original_language: '',
  popularity: 0,
  spoken_languages: [],
  status: '',
  tagline: '',
  video: false,
  vote_count: 0,
  title: '',
  ids: {},
  poster_path: '',
  original_title: '',
  release_date: '',
  vote_average: 0,
  genres: [],
  id: 0,
  backdrop_path: '',
  overview: '',
  runtime: 0,
  origin_country: [],
  production_countries: [],
  production_companies: [],
  budget: 0,
  revenue: 0,
  similar: { results: [], page: 0, total_pages: 0, total_results: 0 },
  credits: { crew: [], cast: [] },
  external_ids: {},
  release_dates: {
    results: [],
    page: 0,
    total_pages: 0,
    total_results: 0,
  },
};

const formatMoney = new Intl.NumberFormat(undefined, { style: 'currency', currency: 'USD' }).format;

/**
 * @docs https://developer.themoviedb.org/reference/movie-details
 * @param {MaybeRefOrGetter<'movie'|'tv'>} type type of item
 * @param {MaybeRefOrGetter<string>} id id of item
 */
export function useCollectItemData(type, id) {
  type = toRef(type);
  id = toRef(id);

  const store = useTMDBStore();
  const regionsStore = useRegionsStore();
  const url = computed(() => `${type.value}/${id.value}?append_to_response=credits,external_ids,similar,release_dates`);
  /** @type {{data: Ref<ItemMovieResponse | ItemTVResponse>, error: Ref<any>, isFetching: Ref<boolean>}} */
  // @ts-ignore
  const { data: response, error, isFetching: isLoading } = store.fetch(url, { initialData }).get().json();
  const { buildTMDBImageUrl } = useUrlBuild();

  const certification = computed(() => {
    if ('release_dates' in response.value && response.value.release_dates.results?.length) {
      return findCertification(response.value.release_dates, store.region);
    }
    return null;
  });

  const hero = computed(() => ({
    id: response.value.id,
    type: type.value,
    ids: {
      tmdb: response.value.id,
      imdb: response.value.external_ids.imdb_id,
      wikidata: response.value.external_ids.wikidata_id,
    },
    image: response.value.poster_path ? buildTMDBImageUrl(response.value.poster_path, imageTypes.POSTER, [imageQualities.HIGH, null]).href : '',
    // @ts-ignore
    title: response.value.title || response.value.name,
    // @ts-ignore
    originalTitle: response.value.original_title || response.value.original_name,
    // @ts-ignore
    releaseDate: (response.value.release_date || response.value.first_air_date) ? new Date(response.value.release_date || response.value.first_air_date) : undefined,
    voteAverage: response.value.vote_average,
    genres: response.value.genres,
    overview: response.value.overview,
    // @ts-ignore
    runtime: response.value.runtime ? new Date(0, 0, 0, 0, response.value.runtime) : undefined,
    productionCountries: response.value.production_countries.map(({ iso_3166_1 }) => ({
      name: regionsStore.regions[iso_3166_1],
      id: iso_3166_1,
    })),
    productionCompanies: response.value.production_companies, // uses only for StartSearch
    certification: certification.value,
    isAdult: response.value.adult || certification.value === '18+',
    // @ts-ignore
    budget: response.value.budget ? formatMoney(response.value.budget) : undefined,
    // @ts-ignore
    revenue: response.value.budget ? formatMoney(response.value.revenue) : undefined,
  }));

  // @ts-ignore
  const similar = computed(() => response.value.similar.results.map(({ title, name, id, poster_path, release_date, first_air_date, backdrop_path, vote_average, media_type }) => ({
    title: title || name,
    id,
    backdropImage: buildTMDBImageUrl(backdrop_path, imageTypes.BACKDROP, [null, imageQualities.AVERAGE]).href,
    voteAverage: vote_average,
    releaseDate: (release_date || first_air_date) ? new Date(release_date || first_air_date) : undefined,
    image: buildTMDBImageUrl(poster_path, imageTypes.POSTER).href,
    link: { name: 'TMDBItem', params: { type: media_type, id } },
  })));
  const peoples = computed(() => ({
    crew: response.value.credits.crew
      .sort((a, b) => b.popularity - a.popularity)
      .map(({ id, name, profile_path, job }) => ({
        id,
        name,
        subName: job,
        image: buildTMDBImageUrl(profile_path, imageTypes.PROFILE, [null, imageQualities.POOR]).href,
      })),
    cast: response.value.credits.cast
      .sort((a, b) => b.popularity - a.popularity)
      .map(({ id, name, profile_path, character }) => ({
        id,
        name,
        subName: character,
        image: buildTMDBImageUrl(profile_path, imageTypes.PROFILE, [null, imageQualities.POOR]).href,
      })),
  }));


  return {
    error,
    isLoading,
    hero,
    peoples,
    similar,
    // @ts-ignore
    collectionId: computed(() => response.value.belongs_to_collection?.id ?? null),
  };
}
