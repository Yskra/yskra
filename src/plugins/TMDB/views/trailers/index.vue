<script lang="ts">
export default {
  name: 'TMDBTrailers',
};
</script>

<script setup lang="ts">
import { collectVideos } from '@/plugins/TMDB/api/collectVideos';
import TrailersItems from './TrailersItems.vue';

const props = defineProps<{
  type: string;
  id: number;
}>();

const { trailers, altTrailers, isLoading } = collectVideos(() => props.type, () => props.id);
</script>

<template>
  <div v-if="isLoading" class="align-center w-full flex justify-center">
    <BaseLoading class="mt-10 h-30 w-30" />
  </div>

  <div v-else>
    <TrailersItems :data="trailers" />
  </div>

  <template v-if="altTrailers.length">
    <BaseDivider
      v-if="trailers.length > 0"
      placement="start"
    >
      {{ $t('more') }}
    </BaseDivider>

    <TrailersItems :data="altTrailers" />
  </template>
</template>
