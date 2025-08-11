/** @import {Ref, MaybeRefOrGetter, ComputedRef} from 'vue' */
/** @typedef {typeof QUERY_TYPES[keyof typeof QUERY_TYPES]} QueryTypeId */
/** @import {LocationQueryValue} from 'vue-router' */

import { computed, ref, toRef } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute } from 'vue-router';
import { useGenresStore } from '@/plugins/TMDB/api/genres.js';
import { ORIGINAL_LANGUAGES_OPTIONS, QUERY_TO_I18N_KEY, QUERY_TYPE_TO_RAW, QUERY_TYPES, RATING_OPTIONS, RELEASE_YEAR_OPTIONS, SELECT_TYPE, SELECT_TYPES, SORT_MOVIE_OPTIONS, SORT_TV_OPTIONS } from './constants.js';

/**
 * @param {MaybeRefOrGetter<'movie' | 'tv'>} type
 * @param {(query: Record<string, LocationQueryValue | LocationQueryValue[]>) => Promise<void>} onUpdateQuery
 */
export function useDiscoverFilter(type, onUpdateQuery) {
  type = toRef(type);

  const route = useRoute();
  const { t } = useI18n();

  const storeGenres = useGenresStore();
  const genreByLocale = computed(() => storeGenres[type.value]);
  /** @type {Ref<Record<QueryTypeId, string[]>>} */
  const localFilters = ref({});
  const clearOption = {
    value: null,
    name: t('clear'),
    selected: false,
  };

  const sortOptions = computed(() => {
    const opts = type.value === 'movie' ? SORT_MOVIE_OPTIONS : SORT_TV_OPTIONS;

    return opts.map(({ id, name }) => ({
      value: id,
      name: t(name),
      selected: isSelected(QUERY_TYPES.SORT, id),
    }));
  });
  const genreOptions = computed(() => {
    return Object.entries(genreByLocale.value).map(([id, name]) => ({
      key: id,
      value: id,
      name,
      selected: isSelected(QUERY_TYPES.GENRE, id),
    }));
  });
  const ratingOptionsGte = computed(() => {
    return [
      clearOption,
      ...RATING_OPTIONS.map((value) => ({
        value,
        name: value,
        selected: isSelected(QUERY_TYPES.RATING_GREATER, value),
        // @ts-ignore
        disabled: Number.parseInt(localFilters.value[QUERY_TYPES.RATING_LESS]) <= value,
      })),
    ];
  });
  const ratingOptionsLte = computed(() => {
    return [
      clearOption,
      ...RATING_OPTIONS.map((value) => ({
        value,
        name: value,
        selected: isSelected(QUERY_TYPES.RATING_LESS, value),
        // @ts-ignore
        disabled: Number.parseInt(localFilters.value[QUERY_TYPES.RATING_GREATER]) >= value,
      })),
    ];
  });
  const originalLanguageOptions = computed(() => {
    return ORIGINAL_LANGUAGES_OPTIONS.map(({ value, name }) => ({
      value,
      name,
      selected: isSelected(QUERY_TYPES.ORIGINAL_LANGUAGE, value),
    }));
  });
  const releaseYearOptions = computed(() => {
    return RELEASE_YEAR_OPTIONS.map((value) => ({
      value,
      name: value,
      selected: isSelected(type.value === 'movie' ? QUERY_TYPES.RELEASE_DATE_YEAR : QUERY_TYPES.FIRST_AIR_DATE_YEAR, value),
    }));
  });


  const selects = computed(() => {
    /** @type {ReturnType<typeof createSelectConfig>[]} */
    const result = [
      createSelectConfig(QUERY_TYPES.SORT, sortOptions.value),
      createSelectConfig(QUERY_TYPES.GENRE, genreOptions.value),
      createSelectConfig(QUERY_TYPES.RATING_GREATER, ratingOptionsGte.value),
      createSelectConfig(QUERY_TYPES.RATING_LESS, ratingOptionsLte.value),
      createSelectConfig(QUERY_TYPES.ORIGINAL_LANGUAGE, originalLanguageOptions.value),
      createSelectConfig(type.value === 'movie' ? QUERY_TYPES.RELEASE_DATE_YEAR : QUERY_TYPES.FIRST_AIR_DATE_YEAR, releaseYearOptions.value),
    ];

    if (QUERY_TYPES.COMPANY in localFilters.value) {
      const config = createSelectConfig(QUERY_TYPES.COMPANY, [clearOption]);

      config.selectProps.multiple = false;
      config.selectProps.onChange = () => localFilters.value[QUERY_TYPES.COMPANY] = [];

      result.push(config);
    }

    if (QUERY_TYPES.KEYWORD in localFilters.value) {
      const config = createSelectConfig(QUERY_TYPES.KEYWORD, [clearOption]);

      config.selectProps.multiple = false;
      config.selectProps.onChange = () => localFilters.value[QUERY_TYPES.KEYWORD] = [];

      result.push(config);
    }

    return result;
  });

  return {
    localFilters,
    selects,
    onReset,
  };

  /**
   * Helper function for creating select config
   * @param {QueryTypeId} typeId
   * @param {Array<{ value: string|null, name: string, selected: boolean }>} options
   * @returns {{selectProps: {id: string, title: string, multiple: boolean, onChange: (e: any) => void, onClosed: () => void}, options: Array<{value: any, name: string, selected: boolean}>}} select config
   */
  function createSelectConfig(typeId, options) {
    return {
      selectProps: {
        id: typeId,
        title: t(QUERY_TO_I18N_KEY[typeId]),
        multiple: SELECT_TYPE[typeId] === SELECT_TYPES.MULTIPLE,
        onChange: (/** @type {any} */ e) => onFilterChange(typeId, e),
        onClosed: () => onFilterClose(typeId),
      },
      options,
    };
  }

  /**
   * @param {QueryTypeId} type
   * @param {any} value
   */
  function onFilterChange(type, value) {
    if (SELECT_TYPE[type] === SELECT_TYPES.SINGLE) {
      localFilters.value[type] = value;
    }
    else if (SELECT_TYPE[type] === SELECT_TYPES.MULTIPLE) {
      const ids = localFilters.value[type] ?? [];

      if (ids.includes(value)) {
        ids.splice(ids.indexOf(value), 1);
      }
      else {
        ids.push(value);
      }
      localFilters.value[type] = ids;
    }
  }

  /**
   * @param {QueryTypeId} type
   */
  async function onFilterClose(type) {
    const rawType = QUERY_TYPE_TO_RAW[type];
    const ids = localFilters.value[type];

    const newQuery = { ...route.query };

    if (SELECT_TYPE[type] === SELECT_TYPES.MULTIPLE && ids.length > 0) {
      newQuery[rawType] = ids.join(',');
    }
    else if (SELECT_TYPE[type] === SELECT_TYPES.SINGLE && ids) {
      newQuery[rawType] = ids;
    }
    else {
      delete newQuery[rawType];
    }

    await onUpdateQuery(newQuery);
  }

  async function onReset() {
    await onUpdateQuery({});
  }

  /**
   * @param {QueryTypeId} type
   * @param {string} id
   * @returns {boolean} is selected
   */
  function isSelected(type, id) {
    if (SELECT_TYPE[type] === SELECT_TYPES.SINGLE) {
      // @ts-ignore
      return localFilters.value[type] === id;
    }
    if (SELECT_TYPE[type] === SELECT_TYPES.MULTIPLE) {
      return localFilters.value[type]?.includes(id) ?? false;
    }

    return false;
  }
}
