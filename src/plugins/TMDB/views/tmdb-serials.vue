<script setup lang="ts">
import type { LocationQueryValue } from 'vue-router';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useCollectLists } from '@/plugins/TMDB/api/ItemLists';
import { useDiscoverFilter } from '@/plugins/TMDB/views/discover-page';
import FetchError from '@/plugins/TMDB/views/FetchError.vue';
import { useAppBus } from '@/utils/appBus.js';
import { useCollectDiscover } from '../api/collectDiscover.js';
import { useCollectTrending } from '../api/collectTending.js';

const router = useRouter();
const bus = useAppBus();
const lastYear = (new Date()).getFullYear() - 1;

const { items: popular, error } = useCollectDiscover('tv');
const { items: popularLastYear } = useCollectDiscover('tv', { first_air_date_year: lastYear });
const { items: trendingDay } = useCollectTrending('tv', 'day');
const { items: trendingWeek } = useCollectTrending('tv', 'week');
const { items: nowPlaying } = useCollectLists('tv', 'on_the_air');

const query = ref<Record<string, LocationQueryValue | LocationQueryValue[]>>({});
const { selects } = useDiscoverFilter('tv', async (q) => {
  query.value = q;
});

bus.set('ui.background:presentationMode', true);

function onStartSearch() {
  router.push({ name: 'TMDBDiscover', params: { type: 'tv' }, query: query.value });
}
</script>

<template>
  <FetchError v-if="error" :error="error" />

  <template v-else>
    <div>
      <BaseDivider placement="start" class="text-base">
        {{ $t('popular') }}
      </BaseDivider>
      <YCarousel :items="popular">
        <template #after-items>
          <AppLink :to="{ name: 'TMDBDiscover', params: { type: 'tv' }, query: { sort_by: 'popularity.desc' } }" class="h-full w-full">
            <div v-focus class="h-full w-45 flex items-center justify-center bg-base-300 card">
              <div class="i-mingcute:arrow-right-circle-fill h-4rem w-4rem" />
              <span class="text-center text-base">
                {{ $t('more') }}
              </span>
            </div>
          </AppLink>
        </template>
      </YCarousel>
    </div>
    <BaseDivider />
    <div v-focus-section class="filters-block">
      <BaseButton
        styling="outline"
        color="primary"
        @click="onStartSearch"
      >
        {{ $t('startSearch') }}
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
    <div>
      <BaseDivider placement="start" class="text-base">
        {{ $t('lastYear') }}
      </BaseDivider>
      <YCarousel :items="popularLastYear" />
    </div>
    <div>
      <BaseDivider placement="start" class="text-base">
        {{ $t('trendingDay') }}
      </BaseDivider>
      <YCarousel :items="trendingDay" />
    </div>
    <div>
      <BaseDivider placement="start" class="text-base">
        {{ $t('trendingWeek') }}
      </BaseDivider>
      <YCarousel :items="trendingWeek" />
    </div>
    <div>
      <BaseDivider placement="start" class="text-base">
        {{ $t('currentlyAiring') }}
      </BaseDivider>
      <YCarousel :items="nowPlaying" />
    </div>
  </template>
</template>

<style scoped>
.filters-block {
  @apply w-full bg-base-300 p-5 rounded-lg;
}
</style>
