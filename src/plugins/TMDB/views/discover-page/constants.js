const currentYear = new Date().getFullYear();
const startYear = currentYear - 10;

export const TYPE_TO_I18N_KEY = {
  movie: 'movies',
  tv: 'tvShows',
};

export { default as ORIGINAL_LANGUAGES_OPTIONS } from '../../languagesOriginalMovies.js';

/** @constant */
export const QUERY_TYPES = {
  GENRE: 'genre',
  COMPANY: 'company',
  KEYWORD: 'keyword',
  SORT: 'sort',
  RATING_GREATER: 'ratingGreater',
  RATING_LESS: 'ratingLess',
  ORIGINAL_LANGUAGE: 'originalLanguage',
  RELEASE_DATE_YEAR: 'releaseDateYear', // movies only
  FIRST_AIR_DATE_YEAR: 'firstAirDateYear', // tv shows only
  PAGE: 'page',
};

/** @constant */
export const SELECT_TYPES = {
  SINGLE: 'single',
  MULTIPLE: 'multiple',
};


/** @type {Record<string, (typeof QUERY_TYPES)[keyof typeof QUERY_TYPES]>} */
export const RAW_QUERY_TO_TYPE = {
  'page': QUERY_TYPES.PAGE,
  'with_genres': QUERY_TYPES.GENRE,
  'with_companies': QUERY_TYPES.COMPANY,
  'with_keywords': QUERY_TYPES.KEYWORD,
  'sort_by': QUERY_TYPES.SORT,
  'vote_average.gte': QUERY_TYPES.RATING_GREATER,
  'vote_average.lte': QUERY_TYPES.RATING_LESS,
  'with_original_language': QUERY_TYPES.ORIGINAL_LANGUAGE,
  'primary_release_year': QUERY_TYPES.RELEASE_DATE_YEAR,
  'first_air_date_year': QUERY_TYPES.FIRST_AIR_DATE_YEAR,
};

/** @type {Record<(typeof QUERY_TYPES)[keyof typeof QUERY_TYPES], string>} */
export const QUERY_TYPE_TO_RAW = Object.fromEntries(Object.entries(RAW_QUERY_TO_TYPE).map(([k, v]) => [v, k]));

export const QUERY_TO_I18N_KEY = {
  [QUERY_TYPES.PAGE]: 'pageOf',
  [QUERY_TYPES.GENRE]: 'byGenre',
  [QUERY_TYPES.COMPANY]: 'byProductionCompany',
  [QUERY_TYPES.KEYWORD]: 'byTag',
  [QUERY_TYPES.SORT]: 'withSort',
  [QUERY_TYPES.RATING_GREATER]: 'voteAverageGreater',
  [QUERY_TYPES.RATING_LESS]: 'voteAverageLess',
  [QUERY_TYPES.ORIGINAL_LANGUAGE]: 'originalLanguage',
  [QUERY_TYPES.RELEASE_DATE_YEAR]: 'releaseYear',
  [QUERY_TYPES.FIRST_AIR_DATE_YEAR]: 'releaseYear',
};

/** @type {Record<(typeof QUERY_TYPES)[keyof typeof QUERY_TYPES], (typeof SELECT_TYPES)[keyof typeof SELECT_TYPES]>} */
export const SELECT_TYPE = {
  [QUERY_TYPES.GENRE]: SELECT_TYPES.MULTIPLE,
  [QUERY_TYPES.COMPANY]: SELECT_TYPES.MULTIPLE,
  [QUERY_TYPES.KEYWORD]: SELECT_TYPES.MULTIPLE,
  [QUERY_TYPES.SORT]: SELECT_TYPES.SINGLE,
  [QUERY_TYPES.RATING_GREATER]: SELECT_TYPES.SINGLE,
  [QUERY_TYPES.RATING_LESS]: SELECT_TYPES.SINGLE,
  [QUERY_TYPES.ORIGINAL_LANGUAGE]: SELECT_TYPES.SINGLE,
  [QUERY_TYPES.RELEASE_DATE_YEAR]: SELECT_TYPES.SINGLE,
  [QUERY_TYPES.FIRST_AIR_DATE_YEAR]: SELECT_TYPES.SINGLE,
};

export const SORT_MOVIE_OPTIONS = [
  { id: 'popularity.asc', name: 'popularityAsc' },
  { id: 'popularity.desc', name: 'popularityDesc' },
  { id: 'vote_average.asc', name: 'voteAverageAsc' },
  { id: 'vote_average.desc', name: 'voteAverageDesc' },
  { id: 'primary_release_date.asc', name: 'releaseDateAsc' },
  { id: 'primary_release_date.desc', name: 'releaseDateDesc' },
  { id: 'title.asc', name: 'titleAsc' },
  { id: 'title.desc', name: 'titleDesc' },
];
export const SORT_TV_OPTIONS = [
  { id: 'popularity.asc', name: 'popularityAsc' },
  { id: 'popularity.desc', name: 'popularityDesc' },
  { id: 'vote_average.asc', name: 'voteAverageAsc' },
  { id: 'vote_average.desc', name: 'voteAverageDesc' },
  { id: 'first_air_date.asc', name: 'airDateAsc' },
  { id: 'first_air_date.desc', name: 'airDateDesc' },
  { id: 'title.asc', name: 'titleAsc' },
  { id: 'title.desc', name: 'titleDesc' },
];

export const SORT_TO_I18N_KEY = Object.fromEntries(
  (new Set([...SORT_MOVIE_OPTIONS, ...SORT_TV_OPTIONS])).values().map(({ id, name }) => [id, name]),
);

export const RATING_OPTIONS = Array.from({ length: 8 }, (_, i) => (i + 2).toString());
export const RELEASE_YEAR_OPTIONS = Array.from({ length: currentYear - startYear }, (_, i) => (currentYear - i).toString());
