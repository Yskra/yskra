<script setup lang="ts">
import type { UseFetchReturn } from '@vueuse/core';
import type { PagionationResponse, People } from '@/plugins/TMDB/Public.js';
import { computed } from 'vue';
import { useCollectPeople } from '@/plugins/TMDB/api/collectPeople';
import { useCollectLists } from '@/plugins/TMDB/api/ItemLists';
import { useTMDBStore } from '@/plugins/TMDB/api/tmdb.js';
import { useAppBus } from '@/utils/appBus.js';
import { useCollectDiscover } from '../api/collectDiscover.js';
import { useCollectTrending } from '../api/collectTending.js';

const bus = useAppBus();
const mainStore = useTMDBStore();

const { items: popular } = useCollectDiscover('movie');
const { items: trendingDay } = useCollectTrending('all', 'day');
const { items: trendingWeek } = useCollectTrending('all', 'week');

const { data: popularPeople }: UseFetchReturn<PagionationResponse<People>> = mainStore.fetch('person/popular').get().json();
const peoples = computed(() => !popularPeople.value ? [] : getRandomTwoUnique(popularPeople.value.results));
const { items: people1 } = useCollectPeople(() => peoples.value[0]?.id ?? 0, 'combined_credits');
const { items: people2 } = useCollectPeople(() => peoples.value[1]?.id ?? 0, 'combined_credits');
const { items: nowPlaying } = useCollectLists('movie', 'now_playing');


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
  <div>
    <BaseDivider placement="start" class="text-base">
      {{ $t('popular') }}
    </BaseDivider>
    <YCarousel :items="popular" />
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
      {{ $t('nowOnCinemas') }}
    </BaseDivider>
    <YCarousel :items="nowPlaying" />
  </div>
  <div v-if="people1.cast.length">
    <BaseDivider placement="start" class="text-base">
      {{ $t('starring', { name: peoples[0].name }) }}
    </BaseDivider>
    <YCarousel :items="people1.cast.slice(0, 25)" />
  </div>
  <div v-if="people2.cast.length">
    <BaseDivider placement="start" class="text-base">
      {{ $t('starring', { name: peoples[1].name }) }}
    </BaseDivider>
    <YCarousel :items="people2.cast.slice(0, 25)" />
  </div>
</template>
