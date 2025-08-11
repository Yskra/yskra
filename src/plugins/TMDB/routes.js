// noinspection SpellCheckingInspection

import { DiscoverPage, Index, TmdbFilms, TmdbIndex, TmdbSerials } from './views';

// @unocss-include

export default [
  {
    path: 'tmdb',
    name: 'TMDBIndex',
    component: TmdbIndex,
    meta: {
      title: 'TheMovieDB',
      icon: 'i-simple-icons:themoviedatabase',
    },
  },
  {
    // type is movie or tv
    path: 'tmdb/discover/:type',
    name: 'TMDBDiscover',
    component: DiscoverPage,
  },
  {
    path: 'tmdb/:type/:id',
    name: 'TMDBItem',
    component: Index,
  },
  {
    path: 'tmdb/films',
    name: 'TMDBFilms',
    component: TmdbFilms,
    meta: {
      title: 'films',
      icon: 'i-mingcute:film-fill',
    },
  },
  {
    path: 'tmdb/serials',
    name: 'TMDBSerials',
    component: TmdbSerials,
    meta: {
      title: 'serials',
      icon: 'i-mingcute:tv-2-fill',
    },
  },
];
