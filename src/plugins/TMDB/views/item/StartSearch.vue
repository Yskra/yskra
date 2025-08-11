<script setup lang="ts">
import type { RouteLocationAsRelativeGeneric } from 'vue-router';
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';

const props = defineProps<{
  type: string;
  links: {
    genres: { id: number; name: string }[];
    companies: { id: number; name: string }[];
    keywords: { id: number; name: string }[];
  };
}>();

const TYPE_TO_I18N_KEY = {
  genres: 'genres',
  companies: 'productionCompanies',
  keywords: 'tags',
};

const { t } = useI18n();
const showLinks = ref(false);
const linksType = ref<keyof typeof props['links']>();
const links = computed(() => linksType.value ? props.links[linksType.value] : []);
const name = computed(() => linksType.value ? t(TYPE_TO_I18N_KEY[linksType.value]) : null);

function getRoute(value: string | number): RouteLocationAsRelativeGeneric {
  return {
    name: 'TMDBDiscover',
    params: { type: props.type },
    query: { [`with_${linksType.value}`]: value.toString() },
  };
}

function openLinks(type: keyof typeof props['links']) {
  showLinks.value = true;
  linksType.value = type;
}
</script>

<template>
  <BaseMenu class="w-full">
    <BaseMenuItem>
      <div v-focus @click="openLinks('genres')">
        {{ $t('genres') }}
      </div>
    </BaseMenuItem>
    <BaseMenuItem>
      <div v-focus @click="openLinks('companies')">
        {{ $t('productionCompanies') }}
      </div>
    </BaseMenuItem>
    <BaseMenuItem>
      <div v-focus @click="openLinks('keywords')">
        {{ $t('tags') }}
      </div>
    </BaseMenuItem>
  </BaseMenu>

  <YDrawer
    v-model:show="showLinks"
    :title="$t('findSimilarWith', { name })"
  >
    <BaseMenu class="h-90vh w-full overflow-y-auto">
      <BaseMenuItem v-for="item in links" :key="item.id">
        <AppLink :to="getRoute(item.id)">
          {{ item.name }}
        </AppLink>
      </BaseMenuItem>
    </basemenu>
  </YDrawer>
</template>
