/** @import {CollectionResponse} from '../Public'; */
/** @import {MaybeRefOrGetter, Ref} from 'vue' */

import { computed, ref, toRef, watch } from 'vue';
import { useTMDBStore } from '@/plugins/TMDB/api/tmdb.js';
import { useUrlBuild } from '@/plugins/TMDB/utils/urlBuild.js';
import { imageQualities, imageTypes } from '../constants.js';

const initialData = {
  name: '',
  parts: [],
};
const placeholderData = {
  name: '',
  parts: Array.from({ length: 4 }).map((_, i) => ({ id: i })),
};

/**
 * @docs https://developer.themoviedb.org/reference/collection-details
 * @param {MaybeRefOrGetter<number|null>} id id
 */
export function useCollectCollectionData(id) {
  id = toRef(id);

  const isLoading = ref(false);
  const url = computed(() => id.value ? `collection/${id.value}` : undefined);
  const store = useTMDBStore();
  /** @type {Ref<CollectionResponse>} */
  const response = ref(initialData);
  const { buildTMDBImageUrl } = useUrlBuild();

  const collection = computed(() =>
    !url.value
      ? undefined
      : ({
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

  watch([url, () => store.language], async ([url]) => {
    if (url) {
      // @ts-ignore
      await refresh(placeholderData);
    }
    await refresh();
  }, { immediate: true });

  return {
    collection,
    isLoading,
  };

  /**
   * @param {typeof initialData} resetData resetData
   */
  async function refresh(resetData = initialData) {
    isLoading.value = true;
    response.value = resetData;

    if (url.value) {
      const { data } = await store.fetch(url.value).get().json();

      response.value = data.value;
    }
    isLoading.value = false;
  }
}
