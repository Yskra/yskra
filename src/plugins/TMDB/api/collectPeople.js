/** @import {PeopleResponse} from '../Public'; */
/** @import {MaybeRefOrGetter, Ref} from 'vue' */

import { computed, ref, toRef, watch } from 'vue';
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

  let abortController = new AbortController();
  const isLoading = ref(false);
  const { buildTMDBImageUrl } = useUrlBuild();
  const store = useTMDBStore();
  const url = computed(() => `person/${id.value}${path.value ? '/' : ''}${path.value}`);
  // @ts-ignore
  /** @type {Ref<PeopleResponse<path['value']>>} */
  const response = ref(initialDataMap[path.value]);
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

  watch([url, () => store.language], async () => {
    // cancel the leading request, sometimes the application localization file loads faster -
    // which triggers a change of the active language in the application,
    // and the downloading of the default language data has not yet been completed and then the default language data can rewrite more current data
    abortController?.abort();
    abortController = new AbortController();

    await refresh();
  }, { immediate: true });

  return {
    items,
  };

  async function refresh() {
    isLoading.value = true;
    response.value = initialDataMap[path.value];

    if (url.value) {
      const { data } = await store.fetch(url.value).get().json();

      response.value = data.value ?? initialDataMap[path.value];
    }
    isLoading.value = false;
  }
}
