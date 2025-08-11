/** @import {KeywordsResponse} from '../Public'; */
/** @import {MaybeRefOrGetter, Ref} from 'vue' */

import { computed, toRef } from 'vue';
import { useTMDBStore } from '@/plugins/TMDB/api/tmdb.js';

/**
 * @docs https://developer.themoviedb.org/reference/keyword-details
 * @param {MaybeRefOrGetter<string>} type type of item
 * @param {MaybeRefOrGetter<string>} id id of item
 */
export function useCollectKeywords(type, id) {
  type = toRef(type);
  id = toRef(id);

  const store = useTMDBStore();
  const url = computed(() => `${type.value}/${id.value}/keywords`);
  /** @type {{data: Ref<KeywordsResponse|null>}} */
  const { data } = store.fetch(url.value).get().json();
  const keywords = computed(() => data.value ? data.value.keywords : []);

  return {
    data,
    keywords,
  };
}
