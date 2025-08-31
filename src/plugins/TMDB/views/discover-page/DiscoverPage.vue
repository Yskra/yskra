<script lang="ts">
export default {
  name: 'TMDBDiscoverPage',
};
</script>

<script setup lang="ts">
import type { QUERY_TYPES } from './constants';
import { syncRefs, until } from '@vueuse/core';
import equal from 'fast-deep-equal';
import { computed, reactive, toRaw, watchEffect } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useCollectDiscover } from '@/plugins/TMDB/api/collectDiscover';
import { useDiscoverTitle } from '@/plugins/TMDB/views/discover-page/useDiscoverTitle';
import { useInfinitePagination } from '@/utils/infinitePagination';
import { useTitle } from '@/utils/title';
import { RAW_QUERY_TO_TYPE } from './constants';
import { useDiscoverFilter } from './filter';

type QueryTypeId = typeof QUERY_TYPES[keyof typeof QUERY_TYPES];

const route = useRoute();
const router = useRouter();

const type = computed(() => route.params.type as 'movie' | 'tv');
const query = computed(() => route.query as Record<string, string>);
const currentPage = computed(() => 'page' in query.value ? Number.parseInt(query.value.page) : 1);
const parsedQuery = computed(() => parseQuery(query.value));

const paginationSource = reactive(useCollectDiscover(type, query));
const { scrollContainerRef, reset, items, totalPages } = useInfinitePagination(paginationSource, loadMore, currentPage, { distance: 150 });
const { title } = useDiscoverTitle(type, parsedQuery, currentPage, totalPages);
const { selects, onReset, localFilters } = useDiscoverFilter(type, updateFilter);

syncRefs(parsedQuery, localFilters);
useTitle(title);

watchEffect(async () => {
  if (
    items.value.length !== 0
    && !paginationSource.isLoading
    && scrollContainerRef.value
    && scrollContainerRef.value.scrollHeight <= scrollContainerRef.value.clientHeight
  ) {
    await loadMore();
  }
});

/**
 * parse query from url to internal ids
 * @param {Record<string, string>} query
 */
function parseQuery(query: Record<string, string>): Record<QueryTypeId, string[]> {
  return Object.fromEntries(
    Object.entries(query)
      .map(([key, value]) => {
        const splitSymbol = value.includes(',') ? ',' : '|';
        const ids = value.split(splitSymbol);

        return [RAW_QUERY_TO_TYPE[key] ?? key, ids];
      }),
  );
}
async function loadMore() {
  await router.replace({ query: { ...query.value, page: currentPage.value + 1 } });
  await until(() => paginationSource.page === currentPage.value).toBeTruthy();
}
async function updateFilter(q: Record<string, any>) {
  if (equal(toRaw(query.value), toRaw(q))) {
    return;
  }
  delete q.page;
  await router.replace({ query: q });
  reset();
}
</script>

<template>
  <div class="h-screen w-full flex flex-col">
    <h1 class="my-4 text-lg font-bold">
      {{ title }}
    </h1>

    <div ref="scrollContainerRef" class="h-0 flex-grow overflow-y-auto">
      <div v-focus-section="{ autofocus: true }" class="discover-page-filters-block">
        <BaseButton
          styling="outline"
          color="primary"
          @click="onReset"
        >
          {{ $t('clear') }}
        </BaseButton>
        <BaseSelect
          v-for="select in selects"
          v-bind="select.selectProps"
          :key="select.selectProps.id"
          class="ml-2"
        >
          <BaseSelectItem
            v-for="option in select.options"
            v-bind="option"
            :key="option.value"
          >
            {{ option.name }}
          </BaseSelectItem>
        </BaseSelect>
      </div>

      <BaseDivider />

      <YGrid :items="items" />
    </div>
  </div>
</template>

<style scoped>
.discover-page-filters-block {
  @apply w-full bg-base-300 p-3 rounded-lg;
}
</style>
