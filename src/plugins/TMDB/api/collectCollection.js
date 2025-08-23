/** @import {CollectionResponse} from '../Public'; */
/** @import {MaybeRefOrGetter, Ref} from 'vue' */

import { computed, toRef, watchEffect } from 'vue';
import { useTMDBStore } from '@/plugins/TMDB/api/tmdb.js';
import { useUrlBuild } from '@/plugins/TMDB/utils/urlBuild.js';
import { imageQualities, imageTypes } from '../constants.js';

const initialData = {
  name: '',
  parts: [],
};
// const placeholderData = {
//   name: '',
//   parts: Array.from({ length: 4 }).map((_, i) => ({ id: i })),
// };

/**
 * @docs https://developer.themoviedb.org/reference/collection-details
 * @param {MaybeRefOrGetter<number|null>} id id
 */
export function useCollectCollectionData(id) {
  id = toRef(id);

  const store = useTMDBStore();
  /** @type {{data: Ref<CollectionResponse>, error: Ref<any>, isFetching: Ref<boolean>}} */
  // @ts-ignore
  const { data: response, error, isFetching: isLoading, execute } = store.fetch(() => `collection/${id.value}`, { initialData, immediate: false }).get().json();
  const { buildTMDBImageUrl } = useUrlBuild();

  const collection = computed(() =>
    id.value && ({
      name: response.value.name,
      parts: response.value.parts.map(({ id, title, poster_path, release_date, media_type: type, backdrop_path, vote_average }) => ({
        id,
        title,
        backdropImage: buildTMDBImageUrl(backdrop_path, imageTypes.BACKDROP, [null, imageQualities.AVERAGE]).href,
        voteAverage: vote_average,
        releaseDate: release_date ? new Date(release_date) : undefined,
        image: buildTMDBImageUrl(poster_path, imageTypes.POSTER).href,
        link: { name: 'TMDBItem', params: { type, id } },
      })),
    }),
  );

  watchEffect(async () => {
    if (id.value) {
      await execute();
    }
  });

  return {
    error,
    isLoading,
    collection,
  };
}
