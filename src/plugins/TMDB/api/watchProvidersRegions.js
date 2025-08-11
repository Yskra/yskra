import { acceptHMRUpdate, defineStore } from 'pinia';
import { computed, ref, toRef } from 'vue';
import { useRegionsStore } from './regions.js';

export const useJustWatchStore = defineStore('tmdb.watchProvidersRegions', () => {
  const regionsStore = useRegionsStore();
  const filterRegion = ref('');
  const filterRegionLabel = computed(() => regionsStore.regions[filterRegion.value]);

  return {
    filterRegion,
    filterRegionLabel,
    regions: toRef(() => regionsStore.regions),
  };
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useJustWatchStore, import.meta.hot));
}
