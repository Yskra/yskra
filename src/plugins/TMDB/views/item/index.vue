<script lang="ts">
export default {
  name: 'TMDBItem',
};
</script>

<script setup lang="ts">
import type { FilmCardAction } from '@/plugins/UiKit/lib/film-card/Public';
import { Icon } from '@icon';
import { h, toRef } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute } from 'vue-router';
import { useAppBus } from '@/modules/appBus/index.js';
import { useCollectCollectionData } from '@/plugins/TMDB/api/collectCollection.js';
import { useCollectItemData } from '@/plugins/TMDB/api/collectItem.js';
import { useCollectKeywords } from '@/plugins/TMDB/api/collectKeywords.js';
import { useTMDBStore } from '@/plugins/TMDB/api/tmdb';
import AdultChallenge from '@/plugins/TMDB/views/adult-challenge.vue';
import FetchError from '@/plugins/TMDB/views/FetchError.vue';
import StartSearch from '@/plugins/TMDB/views/item/StartSearch.vue';
import { useTitle } from '@/utils/title';

const route = useRoute();
const bus = useAppBus();

const type = toRef(() => route.params.type as 'movie' | 'tv');
const id = toRef(() => route.params.id as string);

const store = useTMDBStore();
const { hero, peoples, similar, collectionId, isLoading, error } = useCollectItemData(type, id);
const { collection } = useCollectCollectionData(collectionId);
const { t } = useI18n();
const additionalActions: FilmCardAction[] = [
  {
    id: 'search',
    name: 'findSimilar',
    icon: h(Icon, { name: 'line-md-search-twotone' }),
    isAvailable: () => true,
    action: (ctx) => {
      const { keywords } = useCollectKeywords(type, id);

      bus.call('ui.dialog:drawer', {
        title: t('findSimilar'),
        targetRef: ctx?.event?.target as Element,
        body: h(() => h(StartSearch, {
          type: type.value,
          links: {
            genres: hero.value.genres,
            companies: hero.value.productionCompanies,
            keywords: keywords.value,
          },
        })),
      });
    },
  },
];

useTitle(() => isLoading.value && !error.value ? '' : `${hero.value.title} (${hero.value.releaseDate?.getFullYear()})`);
</script>

<template>
  <FetchError v-if="error" :error="error" />

  <AdultChallenge v-else-if="hero.isAdult && !store.adultPassed" @pass="store.tryPassedAdult($event)" />

  <FilmCard
    v-else
    :is-loading="isLoading"
    :hero="hero"
    :similar="similar"
    :peoples="peoples"
    :collection="collection"
    :additional-actions="additionalActions"
  />
</template>
