<script lang="ts">
export type { FilmCardAction, FilmCardButtonPayload, FilmCardOrderItem } from './Public';
export { useFilmCardStore } from './store';
export { default as FilmCardActions } from './ui/FilmCardActions.vue';
export { default as FilmCardHero } from './ui/FilmCardHero.vue';
export { default as FilmCardMeta } from './ui/FilmCardMeta.vue';
export { default as FilmCardPeople } from './ui/FilmCardPeople.vue';
export { default as FilmCardRatings } from './ui/FilmCardRatings.vue';

export default {
  name: 'FilmCard',
};
</script>

<script setup lang="ts">
import type { Props as RCarouselProps } from '../r-carousel';
import type { FilmCardAction, FilmCardIDs } from './Public';
import type { People } from './ui/FilmCardPeople.vue';
import { storeToRefs } from 'pinia';
import { computed, toRef, watch } from 'vue';
import { useAppBus } from '@/utils/appBus';
import { useFilmCardStore } from './store';
import FilmCardActions from './ui/FilmCardActions.vue';
import FilmCardHero from './ui/FilmCardHero.vue';
import FilmCardInfoSheet from './ui/FilmCardInfoSheet.vue';
import FilmCardMeta from './ui/FilmCardMeta.vue';
import FilmCardPeople from './ui/FilmCardPeople.vue';
import FilmCardRatings from './ui/FilmCardRatings.vue';


export interface Props {
  hero: {
    id: number;
    type: 'movie' | 'tv';
    ids: FilmCardIDs;
    image: string;
    overview: string;
    title: string;
    originalTitle: string;
    releaseDate: Date;
    runtime: Date;
    productionCountries: { id: unknown; name: string }[];
    genres: [{ id: unknown; name: string }];
    voteAverage: number;
    certification: string;
    revenue: string;
    budget: string;
  };
  similar: RCarouselProps['items'];
  collection?: {
    name?: string;
    parts?: RCarouselProps['items'];
  };
  peoples: {
    crew: People[];
    cast: People[];
  };
  isLoading: boolean;
  additionalActions?: FilmCardAction[];
}
const { hero, additionalActions = [] } = defineProps<Props>();
const store = useFilmCardStore();
const { actionsOrder } = storeToRefs(store);
const bus = useAppBus();


const filmCardBtnPayload = toRef(() => hero);
const filteredSortedActions = computed(() =>
  [...additionalActions, ...store.actions]
    .filter((e) => e.isAvailable(filmCardBtnPayload.value))
    .map((e) => ({ ...e, action: (event: Event) => e.action({ event, ...filmCardBtnPayload.value }) }))
    .toSorted((a, b) => {
      const aIndex = findIndexOrZero(actionsOrder.value, (i) => i.id === a.id);
      const bIndex = findIndexOrZero(actionsOrder.value, (i) => i.id === b.id);

      return aIndex - bIndex;
    }),
);

watch(() => hero.image, (value) => {
  bus.call('ui.background:setImage', value);
}, { immediate: true });

function findIndexOrZero<T = any>(arr: T[], predicate: (item: T) => boolean): number {
  const index = arr.findIndex(predicate);

  return index === -1 ? arr.length : index;
}
</script>

<template>
  <div class="film-card">
    <div class="flex flex-basis-100% flex-col justify-between overflow-x-auto rounded-xl bg-base-200 p-5">
      <FilmCardHero v-bind="hero" :is-loading="isLoading">
        <template #top>
          <FilmCardMeta v-bind="hero" :is-loading="isLoading" />
        </template>
        <template #middle>
          <FilmCardRatings v-bind="hero" :is-loading="isLoading" />
          <FilmCardActions v-if="hero.id" :actions="filteredSortedActions" />
        </template>
        <template #bottom>
          <FilmCardInfoSheet v-bind="hero" :is-loading="isLoading" />
        </template>
      </FilmCardHero>

      <template v-if="collection">
        <BaseDivider />

        <h1 class="mb-3 text-lg font-bold">
          {{ collection.name }}
        </h1>
        <YCarousel
          :items="collection.parts"
          class="collection-carousel"
        />
      </template>

      <BaseDivider />

      <h1 class="mb-3 text-lg font-bold">
        {{ $t('similar') }}
      </h1>
      <YCarousel :items="similar" />
    </div>

    <div class="ml-4 min-w-70">
      <div>
        <FilmCardPeople :peoples="peoples.crew.slice(0, 5)">
          {{ $t('team') }}
        </FilmCardPeople>
        <FilmCardPeople :peoples="peoples.cast.slice(0, 10)">
          {{ $t('cast') }}
        </FilmCardPeople>
      </div>
    </div>
  </div>
</template>

<style scoped>
.film-card {
  @apply w-full flex p-5;
}
</style>
