/** @import {PeopleResponse} from '../Public'; */
/** @import {MaybeRefOrGetter, Ref} from 'vue' */

import { computed, toRef } from 'vue';
import { useTMDBStore } from '@/plugins/TMDB/api/tmdb.js';
import { imageQualities, imageTypes } from '@/plugins/TMDB/constants.js';
import { useUrlBuild } from '@/plugins/TMDB/utils/urlBuild.js';

/** @type {PeopleResponse<''>} */
const initialData1 = {
  id: 0,
  name: '',
  profile_path: '',
  popularity: 0,
};

/** @type {PeopleResponse<'combined_credits'>} */
const initialData2 = {
  id: 0,
  cast: [],
  crew: [],
};

const initialDataMap = {
  '': initialData1,
  'combined_credits': initialData2,
};

/**
 * @docs https://developer.themoviedb.org/reference/person-details
 * @param {MaybeRefOrGetter<number>} id id of person
 * @param {MaybeRefOrGetter<'' | 'combined_credits'>} path url path api
 */
export function useCollectPeople(id, path = '') {
  id = toRef(id);
  path = toRef(path);

  const { buildTMDBImageUrl } = useUrlBuild();
  const store = useTMDBStore();
  const url = computed(() => `person/${id.value}${path.value ? '/' : ''}${path.value}`);
  /** @type {{data: Ref<PeopleResponse<path['value']>, error: Ref<any>, isFetching: Ref<boolean>}} */
  // @ts-ignore
  const { data: response, error, isFetching: isLoading } = store.fetch(url, { initialData: initialDataMap[path.value] }).get().json();

  const items = computed(() => {
    if (path.value === 'combined_credits') {
      const cast = response.value.cast.map(({ title, name, id, poster_path, release_date, first_air_date, backdrop_path, vote_average, media_type }) => ({
        title: title || name,
        id,
        backdropImage: buildTMDBImageUrl(backdrop_path, imageTypes.BACKDROP, [null, imageQualities.AVERAGE]).href,
        voteAverage: vote_average,
        releaseDate: (release_date || first_air_date) ? new Date(release_date || first_air_date) : undefined,
        image: buildTMDBImageUrl(poster_path, imageTypes.POSTER).href,
        link: { name: 'TMDBItem', params: { type: media_type, id } },
      }));
      const crew = response.value.crew.map(({ title, name, id, poster_path, release_date, first_air_date, backdrop_path, vote_average, media_type }) => ({
        title: title || name,
        id,
        backdropImage: buildTMDBImageUrl(backdrop_path, imageTypes.BACKDROP, [null, imageQualities.AVERAGE]).href,
        voteAverage: vote_average,
        releaseDate: (release_date || first_air_date) ? new Date(release_date || first_air_date) : undefined,
        image: buildTMDBImageUrl(poster_path, imageTypes.POSTER).href,
        link: { name: 'TMDBItem', params: { type: media_type, id } },
      }));

      return { cast, crew };
    }
    if (path.value === '') {
      return {
        id: response.value.id,
        name: response.value.name,
        image: buildTMDBImageUrl(response.value.profile_path, imageTypes.PROFILE, [null, imageQualities.POOR]).href,
      };
    }

    return response.value;
  });

  return {
    error,
    isLoading,
    items,
  };
}
