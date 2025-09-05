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
    isAdult: boolean;
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
const props = withDefaults(defineProps<Props>(), {
  additionalActions: () => [],
});
const store = useFilmCardStore();
const bus = useAppBus();

const filmCardBtnPayload = toRef(() => props.hero);
const filteredSortedActions = computed(() =>
  store.useOrderedActions(props.additionalActions)
    .filter((e) => e.isAvailable(filmCardBtnPayload.value))
    .map((e) => ({ ...e, action: (event: Event) => e.action({ event, ...filmCardBtnPayload.value }) })),
);

watch(() => props.hero.image, (value) => {
  bus.call('ui.background:setImage', value);
}, { immediate: true });
</script>

<template>
  <div class="film-card">
    <div class="flex flex-basis-100% flex-col overflow-x-auto rounded-xl bg-base-200 p-5">
      <FilmCardHero v-bind="props.hero" :is-loading="props.isLoading">
        <template #top>
          <FilmCardMeta v-bind="props.hero" :is-loading="props.isLoading" />
        </template>
        <template #middle>
          <FilmCardRatings v-bind="props.hero" :is-loading="props.isLoading" />
          <FilmCardActions
            v-if="props.hero.id"
            :actions="filteredSortedActions"
            @reorder="store.moveAction"
          />
        </template>
        <template #bottom>
          <FilmCardInfoSheet v-bind="props.hero" :is-loading="props.isLoading" />
        </template>
      </FilmCardHero>

      <template v-if="props.collection">
        <BaseDivider />

        <h1 class="mb-3 text-lg font-bold">
          {{ props.collection.name }}
        </h1>
        <YCarousel
          :items="props.collection.parts"
          class="collection-carousel"
        />
      </template>

      <BaseDivider />

      <h1 class="mb-3 text-lg font-bold">
        {{ $t('similar') }}
      </h1>
      <YCarousel :items="similar" />
    </div>

    <div class="ml-4">
      <div>
        <FilmCardPeople :peoples="props.peoples.crew.slice(0, 5)">
          {{ $t('team') }}
        </FilmCardPeople>
        <FilmCardPeople :peoples="props.peoples.cast.slice(0, 10)">
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
