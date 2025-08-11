<script setup lang="ts">
import type { SearchResult } from '@/plugins/search/Public';
import { debounceFilter, onKeyStroke, watchWithFilter } from '@vueuse/core';
import { computed, nextTick, ref, shallowRef } from 'vue';
import { LIST_TYPES } from '@/plugins/search/constants';
import { useProvidersStore } from '@/plugins/search/stores/providers';
import { useSearchStore } from '@/plugins/search/stores/search';

const query = ref('');
const lastQuery = ref();
const providersStore = useProvidersStore();
const store = useSearchStore();
let controller = new AbortController();
const processing = ref(false);

const initData = computed(() => Object.fromEntries(
  providersStore.providers.map((p) => [p.name, [{ name: '', items: [] }]]),
));

const results = shallowRef<{ [k: string]: SearchResult[] | Error }>(initData.value);
const resultsTotals = computed(() => Object.fromEntries(
  Object.entries(results.value)
    .map(([k, v]) => [
      k,
      v instanceof Error ? 0 : v.reduce((acc, cur) => acc + cur.items.length, 0),
    ]),
));


watchWithFilter(query, (q: string) => {
  if (q.length > 2) {
    onSearch(query.value);
  }
}, { eventFilter: debounceFilter(1000, { maxWait: 2000 }) });

onKeyStroke('Enter', () => onSearch(query.value));

async function onSearch(query: string) {
  if (query === lastQuery.value) {
    return;
  }
  lastQuery.value = query;
  controller?.abort();
  store.addHistoryEntry(query);
  controller = new AbortController();
  processing.value = true;
  results.value = initData.value;

  results.value = await providersStore.searchAll(query, { signal: controller.signal });

  await nextTick();
  processing.value = false;
}

function onClear() {
  query.value = '';
  results.value = initData.value;
}
</script>

<template>
  <div class="w-350">
    <div v-focus-section class="relative mb-2 flex items-center border-2 border-primary px-2 py-1 rounded-box focus-within:focus-cursor">
      <div class="i-mingcute:search-2-fill h-2rem w-2rem color-primary" />
      <BaseInput
        v-model="query"
        class="w-full border-none"
        :placeholder="$t('search')"
      />
      <div
        v-if="query"
        v-focus
        class="absolute right-0 top-50% cursor-pointer p-2 rounded-box -translate-1/2 focus:bg-base-300 hover:bg-base-300"
        @click="onClear"
      >
        <div class="i-mingcute:close-fill h-1rem w-1rem" />
      </div>
    </div>

    <template v-if="query.length">
      <BaseTabs
        styling="border"
        @selected="console.log($event)"
      >
        <BaseTabsItem
          v-for="provider in providersStore.providers"
          :key="provider.id"
        >
          <template #tab>
            <h2 class="text-sm">
              {{ provider.name }}
            </h2>

            <BaseLoading v-if="processing" class="ml-2" />
            <BaseBadge
              v-else
              size="sm"
              class="ml-2"
            >
              <span>
                {{ resultsTotals[provider.name] }}
              </span>
            </BaseBadge>
          </template>
          <div class="max-h-160 w-full overflow-x-hidden overflow-y-auto px-5">
            <template v-if="results[provider.name] instanceof Error">
              <div class="h-full w-full flex flex-col items-center justify-center py-5">
                <div class="i-mingcute:close-circle-line h-5em w-5em" />
                <p>
                  {{ $t('searchError') }}
                </p>
                <p>
                  {{ results[provider.name].code === 20 ? $t('exceededWaitingTime') : results[provider.name].toString() }}
                </p>
              </div>
            </template>

            <template v-else-if="results[provider.name].length || processing">
              <div v-for="result in results[provider.name] as SearchResult[]" :key="result.name">
                <BaseDivider placement="end">
                  {{ result.name }}
                </BaseDivider>
                <BaseMenu v-if="provider.type === LIST_TYPES.LIST" class="w-full">
                  <BaseMenuItem
                    v-for="item in result.items"
                    :key="item.title"
                  >
                    <div v-focus @click="provider.onClick?.(item)">
                      <span>{{ item.title }}</span>
                    </div>
                  </BaseMenuItem>
                </BaseMenu>
                <YCarousel
                  v-else
                  :items="result.items"
                  @item-click="provider.onClick?.($event)"
                />
              </div>
            </template>

            <template v-else>
              <div class="h-full w-full flex flex-col items-center justify-center py-5">
                <div class="i-mingcute:search-ai-fill h-5em w-5em" />
                <p>
                  {{ $t('searchNoResult') }}
                </p>
              </div>
            </template>
          </div>
        </BaseTabsItem>
      </BaseTabs>
    </template>

    <template v-else-if="store.searchHistory.length > 0">
      <BaseDivider placement="start">
        Недавнее
      </BaseDivider>

      <BaseMenu class="w-full">
        <BaseMenuItem v-for="(item, i) in store.searchHistory" :key="item + i">
          <div
            v-focus
            class="flex items-center justify-between"
            @click="query = item"
          >
            <span>
              {{ item }}
            </span>
            <div
              v-focus
              class="absolute right-0 top-50% cursor-pointer p-3 rounded-box -translate-1/2 hover:bg-base-300 focus:focus-cursor"
              @click.stop="store.removeHistoryEntry(i)"
            >
              <div class="i-mingcute:close-fill h-1rem w-1rem" />
            </div>
          </div>
        </BaseMenuItem>
      </BaseMenu>
    </template>
  </div>
</template>

<style scoped>
:deep(.input):focus {
  outline: none;
}
</style>
