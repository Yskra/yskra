/** @import {MaybeRefOrGetter, Ref, ComputedRef, Reactive} from 'vue' */
/** @import {UseInfiniteScrollOptions} from '@vueuse/core' */
import { useInfiniteScroll } from '@vueuse/core';
import { ref, toRef, useTemplateRef, watch } from 'vue';

/**
 * @template T
 * @typedef {object} PagiantionLikeResult
 * @property {ComputedRef<T[]>} items fetched items
 * @property {ComputedRef<number>} totalPages total pages
 */

/**
 * Simple wrap over https://vueuse.org/core/useInfiniteScroll/#useinfinitescroll
 * @template T
 * @param {Reactive<PagiantionLikeResult<T>>} source
 * @param {() => Promise<void>} onLoadMore
 * @param {MaybeRefOrGetter<number>} currentPage
 * @param {UseInfiniteScrollOptions<HTMLElement|null>} scrollOpts
 */
export function useInfinitePagination(source, onLoadMore, currentPage = 1, scrollOpts = { distance: 80 }) {
  currentPage = toRef(currentPage);

  /** @type {Ref<HTMLElement | null>} */
  const scrollContainerRef = useTemplateRef('scrollContainerRef');

  /** @type {Ref<T[]>} */
  const allItems = ref([]);
  const items = toRef(source, 'items');
  const totalPages = toRef(source, 'totalPages');

  const { reset } = useInfiniteScroll(
    scrollContainerRef,
    onLoadMore,
    { canLoadMore: () => currentPage.value < totalPages.value, ...scrollOpts },
  );

  watch(items, (newItems) => {
    if (Array.isArray(newItems)) {
      allItems.value = [...allItems.value, ...newItems];
    }
  }, { immediate: true });

  return {
    // use on use grind with items, ex <YGrid/>
    items: allItems,
    // use on container with scroll
    scrollContainerRef,
    // reset all items, ex you set current page to 1
    reset: () => {
      allItems.value = [];
      reset();
    },
    totalPages,
  };
}
