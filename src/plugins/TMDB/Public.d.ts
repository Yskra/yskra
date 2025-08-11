// noinspection SpellCheckingInspection

import type { RouteLocationRaw } from 'vue-router';
import type defaultConfig from './config.json';

export type Config = typeof defaultConfig;

interface PagionationResponse<T> {
  page: number;
  total_pages: number;
  total_results: number;
  results: T[];
}

export interface SearchResultItem {
  id?: number | string;
  title?: string;
  image?: string;
  releaseDate?: Date;
  voteAverage?: number;
  backdropImage?: string;
  link?: RouteLocationRaw;
}


interface People {
  id: number;
  name: string;
  profile_path: string;
  popularity: number;
}

interface Video {
  type: 'Trailer' | 'Clip';
  id: string;
  name: string;
  key: string;
  site: 'YouTube' | 'Vimeo';
  published_at: string;
}

export interface Trailer extends Video {
  type: 'Trailer';
}

interface ExternalIds {
  imdb_id?: string;
  wikidata_id?: string;
  facebook_id?: string;
  instagram_id?: string;
  twitter_id?: string;
}

type ReleaseDatesResponse = PagionationResponse<{
  iso_3166_1: string;
  release_dates: {
    certification: string;
    iso_639_1: string;
    note: string;
    release_date: string;
    type: typeof ReleaseType[keyof typeof ReleaseType];
  }[];
}>;

interface Country {
  iso_3166_1: string;
  english_name: string;
  native_name: string;
}

interface Keyword {
  id: number;
  name: string;
}

interface Genre {
  id: number;
  name: string;
}

declare enum ReleaseType {
  'Premiere' = 1,
  'Theatrical' = 2,
  'Theatrical (limited)' = 3,
  'Digital' = 4,
  'Physical' = 5,
  'TV' = 6,
}

interface WatchProvider {
  logo_path: string;
  provider_id: number;
  provider_name: string;
  display_priority: number;
}

type WatchProviderRegions
  = 'AD' | 'AE' | 'AF' | 'AG' | 'AI' | 'AL' | 'AM' | 'AO' | 'AQ' | 'AR'
    | 'AS' | 'AT' | 'AU' | 'AW' | 'AX' | 'AZ' | 'BA' | 'BB' | 'BD' | 'BE'
    | 'BF' | 'BG' | 'BH' | 'BI' | 'BJ' | 'BL' | 'BM' | 'BN' | 'BO' | 'BQ'
    | 'BR' | 'BS' | 'BT' | 'BV' | 'BW' | 'BY' | 'BZ' | 'CA' | 'CC' | 'CD'
    | 'CF' | 'CG' | 'CH' | 'CI' | 'CK' | 'CL' | 'CM' | 'CN' | 'CO' | 'CR'
    | 'CU' | 'CV' | 'CW' | 'CX' | 'CY' | 'CZ' | 'DE' | 'DJ' | 'DK' | 'DM'
    | 'DO' | 'DZ' | 'EC' | 'EE' | 'EG' | 'EH' | 'ER' | 'ES' | 'ET' | 'FI'
    | 'FJ' | 'FK' | 'FM' | 'FO' | 'FR' | 'GA' | 'GB' | 'GD' | 'GE' | 'GF'
    | 'GG' | 'GH' | 'GI' | 'GL' | 'GM' | 'GN' | 'GP' | 'GQ' | 'GR' | 'GS'
    | 'GT' | 'GU' | 'GW' | 'GY' | 'HK' | 'HM' | 'HN' | 'HR' | 'HT' | 'HU'
    | 'ID' | 'IE' | 'IL' | 'IM' | 'IN' | 'IO' | 'IQ' | 'IR' | 'IS' | 'IT'
    | 'JE' | 'JM' | 'JO' | 'JP' | 'KE' | 'KG' | 'KH' | 'KI' | 'KM' | 'KN'
    | 'KP' | 'KR' | 'KW' | 'KY' | 'KZ' | 'LA' | 'LB' | 'LC' | 'LI' | 'LK'
    | 'LR' | 'LS' | 'LT' | 'LU' | 'LV' | 'LY' | 'MA' | 'MC' | 'MD' | 'ME'
    | 'MF' | 'MG' | 'MH' | 'MK' | 'ML' | 'MM' | 'MN' | 'MO' | 'MP' | 'MQ'
    | 'MR' | 'MS' | 'MT' | 'MU' | 'MV' | 'MW' | 'MX' | 'MY' | 'MZ' | 'NA'
    | 'NC' | 'NE' | 'NF' | 'NG' | 'NI' | 'NL' | 'NO' | 'NP' | 'NR' | 'NU'
    | 'NZ' | 'OM' | 'PA' | 'PE' | 'PF' | 'PG' | 'PH' | 'PK' | 'PL' | 'PM'
    | 'PN' | 'PR' | 'PS' | 'PT' | 'PW' | 'PY' | 'QA' | 'RE' | 'RO' | 'RS'
    | 'RU' | 'RW' | 'SA' | 'SB' | 'SC' | 'SD' | 'SE' | 'SG' | 'SH' | 'SI'
    | 'SJ' | 'SK' | 'SL' | 'SM' | 'SN' | 'SO' | 'SR' | 'SS' | 'ST' | 'SV'
    | 'SX' | 'SY' | 'SZ' | 'TC' | 'TD' | 'TF' | 'TG' | 'TH' | 'TJ' | 'TK'
    | 'TL' | 'TM' | 'TN' | 'TO' | 'TR' | 'TT' | 'TV' | 'TW' | 'TZ' | 'UA'
    | 'UG' | 'UM' | 'US' | 'UY' | 'UZ' | 'VA' | 'VC' | 'VE' | 'VG' | 'VI'
    | 'VN' | 'VU' | 'WF' | 'WS' | 'YE' | 'YT' | 'ZA' | 'ZM' | 'ZW';

export interface Credits {
  cast: (People & { character: string })[];
  crew: (People & { job: string })[];
}


type SimilarMovieResponse = PagionationResponse<{
  title: string;
  original_title: string;
  id: number;
  poster_path: string;
  release_date: string;
  backdrop_path: string;
  vote_average: number;
}>;

type SimilarTVResponse = PagionationResponse<{
  name: string;
  original_name: string;
  id: number;
  poster_path: string;
  first_air_date: string;
  backdrop_path: string;
  vote_average: number;
}>;

interface GenericItem {
  adult: boolean;
  first_air_date: string;
  backdrop_path: string;
  genre_ids: number[];
  id: number;
  original_language: string;
  original_title: string;
  overview: string;
  popularity: number;
  poster_path: string;
  release_date: string;
  title: string;
  name: string; // sometimes it uses for title, but title is empty
  video: boolean;
  vote_average: number;
  vote_count: number;
}

export type DiscoverResponse = PagionationResponse<GenericItem>;

type MovieListsPath = 'now_playing' | 'popular' | 'upcoming' | 'top_rated';
type TvListsPath = 'airing_today' | 'on_the_air' | 'popular' | 'top_rated';
export type ListsPath<T extends 'movie' | 'tv'> = T extends 'movie' ? MovieListsPath : TvListsPath;
export type ItemListsResponse = PagionationResponse<GenericItem>;

export interface PeopleCombinedCreditsResponse {
  id: number;
  cast: (GenericItem & { character: string; media_type: 'movie' | 'tv' })[];
  crew: (GenericItem & { media_type: 'movie' | 'tv' })[];
}

export type PeopleResponse<P extends string> = P extends '' ? People : P extends 'combined_credits' ? PeopleCombinedCreditsResponse : never;

export type TrendingResponse = PagionationResponse<GenericItem & {
  name: string; // sometimes it uses for title, but title is empty
  media_type: 'movie' | 'tv';
}>;

export type WatchProvidersResponse = PagionationResponse<{
  [k in WatchProviderRegions]?: {
    link: string;
    flatrate?: WatchProvider[];
    rent?: WatchProvider[];
    buy?: WatchProvider[];
  }
}>;

export type JustWatchRegionsResponse = PagionationResponse<{
  iso_3166_1: string;
  english_name: string;
  native_name: string;
}>;

export interface CollectionResponse {
  name: string;
  parts: {
    id: number;
    title: string;
    poster_path: string;
    release_date: string;
    media_type: string;
    backdrop_path: string;
    vote_average: number;
  }[];
}

export interface ItemMovieResponse {
  adult: boolean;
  backdrop_path: string;
  belongs_to_collection?: { id: number; name: string };
  budget: number;
  genres: { id: number; name: string }[];
  homepage: string;
  id: number;
  imdb_id: string;
  origin_country: string[];
  original_language: string;
  original_title: string;
  overview: string;
  popularity: number;
  poster_path: string;
  production_countries: { iso_3166_1: string; name: string }[]; // note: name on english language
  production_companies: { id: number; name: string }[];
  release_date: string;
  revenue: number;
  runtime: number;
  spoken_languages: any[];
  status: 'Released' | string;
  tagline: string;
  title: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
  credits: Credits;
  external_ids: ExternalIds;
  similar: SimilarMovieResponse;
  release_dates: ReleaseDatesResponse;
}

export interface ItemTVResponse {
  adult: boolean;
  backdrop_path: string;
  created_by: any[];
  episode_run_time: number[];
  first_air_date: string;
  genres: { id: number; name: string }[];
  homepage: string;
  id: number;
  in_production: boolean;
  languages: string[];
  last_air_date: string;
  last_episode_to_air: TVEpisode;
  name: string;
  next_episode_to_air: TVEpisode;
  networks: { id: number; logo_path: string; name: string; origin_country: string }[];
  number_of_episodes: number;
  number_of_seasons: number;
  origin_country: string[];
  original_language: string;
  original_name: string;
  overview: string;
  popularity: number;
  poster_path: string;
  production_companies: { id: number; name: string }[];
  production_countries: { iso_3166_1: string; name: string }[]; // note: name on english language
  seasons: TVSeason[];
  spoken_languages: any[];
  status: 'Returning Series' | string;
  tagline: string;
  type: 'Scripted' | string;
  vote_average: number;
  vote_count: number;
  credits: Credits;
  external_ids: ExternalIds;
  similar: SimilarTVResponse;
}

export interface ItemPersonResponse extends People {

}

interface TVEpisode {
  id: number;
  name: string;
  overview: string;
  vote_average: number;
  vote_count: number;
  air_date: string;
  episode_number: number;
  episode_type: 'standard';
  production_code: string;
  runtime: number;
  season_number: number;
  show_id: number;
  still_path: string;
}

interface TVSeason {
  air_date: string;
  episode_count: number;
  id: number;
  name: string;
  overview: string;
  poster_path: string;
  season_number: number;
  vote_average: number;
}

export type VideosResponse = PagionationResponse<Video>;
export interface KeywordsResponse {
  keywords: Keyword[];
}
export type CountiesResponse = PagionationResponse<Country>;
export type SearchResponse = PagionationResponse<ItemMovieResponse>;
export interface GenresResponse {
  genres: Genre[];
}
export interface CompanyResponse {
  description: string;
  headquarters: string;
  homepage: string;
  id: number;
  logo_path: string;
  name: string;
  origin_country: string;
  parent_company: null;
}

export type AllowedDiscoverQuery<T extends 'movie' | 'tv'> = T extends 'movie' ? AllowedDiscoverMovieQuery : AllowedDiscoverTvQuery;

type AllowedDiscoverMovieQuery = Partial<{
  'certification': string;
  'certification_country': string;
  'include_adult': boolean;
  'include_video': boolean;
  'language': string;
  'page': number;
  'primary_release_year': number;
  'primary_release_date.gte': Date;
  'primary_release_date.lte': Date;
  'region': string;
  'release_date.gte': Date;
  'release_date.lte': Date;
  'sort_by':
    'original_title.asc' | 'original_title.desc'
    | 'popularity.asc' | 'popularity.desc'
    | 'revenue.asc' | 'revenue.desc'
    | 'primary_release_date.asc'
    | 'title.asc' | 'title.desc'
    | 'primary_release_date.desc'
    | 'vote_average.asc' | 'vote_average.desc'
    | 'vote_count.asc' | 'vote_count.desc';
  'vote_average.gte': number;
  'vote_average.lte': number;
  'vote_count.gte': number;
  'vote_count.lte': number;
  'watch_region': string;
  'with_cast': string;
  'with_companies': string;
  'with_crew': string;
  'with_genres': string;
  'with_keywords': string;
  'with_origin_country': string;
  'with_original_language': string;
  'with_people': string;
  'with_release_type': number;
  'with_runtime.gte': number;
  'with_runtime.lte': number;
  'with_watch_monetization_types': string;
  'with_watch_providers': string;
  'without_companies': string;
  'without_genres': string;
  'without_keywords': string;
  'without_watch_providers': string;
  'year': number;
}>;

type AllowedDiscoverTvQuery = Partial<{
  'air_date.gte': Date;
  'air_date.lte': Date;
  'first_air_date_year': number;
  'first_air_date.gte': Date;
  'first_air_date.lte': Date;
  'include_adult': boolean;
  'include_null_first_air_dates': boolean;
  'language': string;
  'page': number;
  'screened_theatrically': boolean;
  'sort_by':
    'first_air_date.asc' | 'first_air_date.desc'
    | 'name.asc' | 'name.desc'
    | 'original_name.asc' | 'original_name.desc'
    | 'popularity.asc' | 'popularity.desc'
    | 'vote_average.asc' | 'vote_average.desc'
    | 'vote_count.asc' | 'vote_count.desc';
  'timezone': string;
  'vote_average.gte': number;
  'vote_average.lte': number;
  'vote_count.gte': number;
  'vote_count.lte': number;
  'watch_region': string;
  'with_companies': string;
  'with_genres': string;
  'with_keywords': string;
  'with_networks': number;
  'with_origin_country': string;
  'with_original_language': string;
  'with_runtime.gte': number;
  'with_runtime.lte': number;
  'with_status': string;
  'with_watch_monetization_types': string;
  'with_watch_providers': string;
  'without_companies': string;
  'without_genres': string;
  'without_keywords': string;
  'without_watch_providers': string;
  'with_type': string;
}>;
