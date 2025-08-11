/** @import {Ref, MaybeRefOrGetter, ComputedRef} from 'vue' */
/** @typedef {typeof QUERY_TYPES[keyof typeof QUERY_TYPES]} QueryTypeId */


import { asyncComputed } from '@vueuse/core';
import { computed, toRef } from 'vue';
import { useI18n } from 'vue-i18n';
import { useGenresStore } from '@/plugins/TMDB/api/genres';
import { useTMDBStore } from '@/plugins/TMDB/api/tmdb';
import { QUERY_TO_I18N_KEY, QUERY_TYPES, SORT_TO_I18N_KEY, TYPE_TO_I18N_KEY } from './constants.js';

/**
 *
 * @param {MaybeRefOrGetter<'movie' | 'tv'>} type
 * @param {Ref<Record<QueryTypeId, string[]>>} parsedQuery
 * @param {ComputedRef<number>} currentPage
 * @param {Ref<number>} totalPages
 */
export function useDiscoverTitle(type, parsedQuery, currentPage, totalPages) {
  type = toRef(type);

  const { t } = useI18n();
  const store = useTMDBStore();
  const storeGenres = useGenresStore();
  const genreByLocale = computed(() => storeGenres[type.value]);

  const getCompanyName = async (/** @type {string} */ id) => {
    const { data } = await store.fetch(`company/${id}`).get().json();

    return data.value?.name || id;
  };

  const queryIDsToName = asyncComputed(() => useQueryIDsToName(parsedQuery.value), parsedQuery.value);

  const title = computed(() => t(TYPE_TO_I18N_KEY[type.value], {
    target: Object.entries(parsedQuery.value)
      .map(([type, ids]) => {
        const key = QUERY_TO_I18N_KEY[type];

        if (!key || !queryIDsToName.value[type]) {
          return `${type}=${ids}`;
        }
        const plural = ids.length;
        const n = queryIDsToName.value[type].join(', ');

        return t(key, plural, { named: { n } });
      })
      .join(` ${t('and')} `),
  }));

  /**
   * get names for internal ids and compile to Record
   * @param {Record<QueryTypeId, string[]>} query
   * @returns {Promise<Record<QueryTypeId, any[]>>} **
   */
  async function useQueryIDsToName(query) {
    const entriesTypeNames = Object.entries(query).map(async ([queryType, ids]) => {
      const names = await Promise.all(ids.map(async (id) => {
        if (queryType === QUERY_TYPES.GENRE) {
          return genreByLocale.value[id];
        }
        else if (queryType === QUERY_TYPES.COMPANY) {
          return await getCompanyName(id);
        }
        else if (queryType === QUERY_TYPES.SORT) {
          return t(SORT_TO_I18N_KEY[id]);
        }
        else if (queryType === QUERY_TYPES.PAGE) {
          return `${currentPage.value}/${totalPages.value}`;
        }
        return id;
      }));

      return [queryType, names];
    });

    return Object.fromEntries(await Promise.all(entriesTypeNames));
  }

  return { title };
}
