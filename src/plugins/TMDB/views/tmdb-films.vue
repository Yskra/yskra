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

const { items: popular, isLoading: popularLoading, error } = useCollectDiscover('movie');
const { items: trendingDay, isLoading: trendingDayLoading } = useCollectTrending('movie', 'day');
const { items: trendingWeek, isLoading: trendingWeekLoading } = useCollectTrending('movie', 'week');
const { items: nowPlaying, isLoading: nowPlayingLoading } = useCollectLists('movie', 'now_playing');

const query = ref<Record<string, LocationQueryValue | LocationQueryValue[]>>({});
const { selects } = useDiscoverFilter('movie', async (q) => {
  query.value = q;
});

bus.set('ui.background:presentationMode', true);

function onStartSearch() {
  router.push({ name: 'TMDBDiscover', params: { type: 'movie' }, query: query.value });
}
</script>

<template>
  <FetchError v-if="error" :error="error" />

  <template v-else>
    <div>
      <BaseDivider placement="start" class="text-base">
        {{ $t('popular') }}
      </BaseDivider>
      <YCarousel :items="popular" :is-loading="popularLoading">
        <template #after-items>
          <AppLink :to="{ name: 'TMDBDiscover', params: { type: 'movie' }, query: { sort_by: 'popularity.desc' } }" class="h-full w-full">
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
        {{ $t('trendingDay') }}
      </BaseDivider>
      <YCarousel :items="trendingDay" :is-loading="trendingDayLoading" />
    </div>
    <div>
      <BaseDivider placement="start" class="text-base">
        {{ $t('trendingWeek') }}
      </BaseDivider>
      <YCarousel :items="trendingWeek" :is-loading="trendingWeekLoading" />
    </div>
    <div>
      <BaseDivider placement="start" class="text-base">
        {{ $t('nowOnCinemas') }}
      </BaseDivider>
      <YCarousel :items="nowPlaying" :is-loading="nowPlayingLoading" />
    </div>
  </template>
</template>

<style scoped>
.filters-block {
  @apply w-full bg-base-300 p-5 rounded-lg;
}
</style>
