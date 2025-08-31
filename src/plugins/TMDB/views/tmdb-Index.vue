<script setup lang="ts">
import type { UseFetchReturn } from '@vueuse/core';
import type { PagionationResponse, People } from '@/plugins/TMDB/Public.js';
import { computed } from 'vue';
import { useCollectPeople } from '@/plugins/TMDB/api/collectPeople';
import { useCollectLists } from '@/plugins/TMDB/api/ItemLists';
import { useTMDBStore } from '@/plugins/TMDB/api/tmdb.js';
import FetchError from '@/plugins/TMDB/views/FetchError.vue';
import { useAppBus } from '@/utils/appBus.js';
import { useCollectDiscover } from '../api/collectDiscover.js';
import { useCollectTrending } from '../api/collectTending.js';

const bus = useAppBus();
const mainStore = useTMDBStore();

const { items: popular, isLoading: popularLoading, error } = useCollectDiscover('movie');
const { items: trendingDay, isLoading: trendingDayLoading } = useCollectTrending('all', 'day');
const { items: trendingWeek, isLoading: trendingWeekLoading } = useCollectTrending('all', 'week');

const { data: popularPeople }: UseFetchReturn<PagionationResponse<People>> = mainStore.fetch('person/popular').get().json();
const peoples = computed(() => !popularPeople.value ? [] : getRandomTwoUnique(popularPeople.value.results));
const { items: people1, isLoading: people1Loading } = useCollectPeople(() => peoples.value[0]?.id ?? 0, 'combined_credits');
const { items: people2, isLoading: people2Loading } = useCollectPeople(() => peoples.value[1]?.id ?? 0, 'combined_credits');
const { items: nowPlaying, isLoading: nowPlayingLoading } = useCollectLists('movie', 'now_playing');


bus.set('ui.background:presentationMode', true);

function getRandomTwoUnique<T = any>(arr: T[]): [T, T] {
  const index1 = Math.floor(Math.random() * arr.length);
  let index2;

  do {
    index2 = Math.floor(Math.random() * arr.length);
  } while (index2 === index1);

  return [arr[index1], arr[index2]];
}
</script>

<template>
  <FetchError v-if="error" :error="error" />

  <template v-else>
    <div>
      <BaseDivider placement="start" class="text-base">
        {{ $t('popular') }}
      </BaseDivider>
      <YCarousel :items="popular" :is-loading="popularLoading" />
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
    <div v-if="people1.cast.length">
      <BaseDivider placement="start" class="text-base">
        {{ $t('starring', { name: peoples[0].name }) }}
      </BaseDivider>
      <YCarousel :items="people1.cast.slice(0, 25)" :is-loading="people1Loading" />
    </div>
    <div v-if="people2.cast.length">
      <BaseDivider placement="start" class="text-base">
        {{ $t('starring', { name: peoples[1].name }) }}
      </BaseDivider>
      <YCarousel :items="people2.cast.slice(0, 25)" :is-loading="people2Loading" />
    </div>
  </template>
</template>
