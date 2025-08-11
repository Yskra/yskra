<script>
export default {
  name: 'TMDBWatchProviders',
};
</script>

<script setup>
import { useJustWatchStore } from '@/plugins/TMDB/api/watchProvidersRegions.js';
import { useCollectWatchProvider } from '../../api/collectWatchProdiver.js';
import WatchProviderSelection from './WatchProviderSelection.vue';

const props = defineProps({
  type: { type: String, required: true },
  id: { type: Number, required: true },
});

const { watchProviders: data, isLoading, availableRegions } = useCollectWatchProvider(() => props.type, () => props.id);
const store = useJustWatchStore();
</script>

<template>
  <div>
    <p class="text-md mb-3 max-w-180">
      {{ $t('justWatchNote') }}
    </p>

    <BaseSelect
      :title="$t('region', { name: store.filterRegionLabel })"
      @change="store.filterRegion = $event"
    >
      <BaseSelectItem
        v-for="item in availableRegions"
        :key="item.value"
        :value="item.value"
      >
        {{ item.label }}
      </BaseSelectItem>
    </BaseSelect>

    <BaseLoading v-if="isLoading" class="ml-5" />
    <div v-else>
      <template v-if="data?.flatrate">
        <WatchProviderSelection :data="data.flatrate">
          {{ $t('streaming') }}
        </WatchProviderSelection>
      </template>
      <template v-if="data?.rent">
        <WatchProviderSelection :data="data.rent">
          {{ $t('rent') }}
        </WatchProviderSelection>
      </template>
      <template v-if="data?.buy">
        <WatchProviderSelection :data="data.buy">
          {{ $t('license') }}
        </WatchProviderSelection>
      </template>
    </div>
  </div>
</template>

<style scoped>

</style>
