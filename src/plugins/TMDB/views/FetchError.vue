<script setup lang="ts">
import { watchEffect } from 'vue';
import { useRoute } from 'vue-router';
import { useTMDBStore } from '@/plugins/TMDB/api/tmdb';
import Logger from '@/utils/Logger';

const props = defineProps<{
  error: any;
}>();
const logger = new Logger('TheMovieDB');
const store = useTMDBStore();
const location = window.location.href;
const route = useRoute();

watchEffect(() => {
  logger.error(props.error);
});
</script>

<template>
  <div class="mt-30 w-full flex flex-col items-center justify-center rounded-box">
    <h2 class="text-center text-xl">
      {{ $t('fetchFiledTmdb') }}
    </h2>
    <BaseMenu class="mt-5 bg-base-200">
      <BaseMenuItem>
        <div class="flex justify-between">
          <span class="mr-10 font-bold">{{ $t('error') }}</span>
          <span>{{ props.error.message }}</span>
        </div>
      </BaseMenuItem>
      <BaseMenuItem>
        <div class="flex justify-between">
          <span class="mr-10 font-bold">{{ $t('currentPage') }}</span>
          <span>{{ location }}</span>
        </div>
      </BaseMenuItem>
      <BaseMenuItem>
        <div class="flex justify-between">
          <span class="mr-10 font-bold">{{ $t('pageId') }}</span>
          <span>{{ route.name }}</span>
        </div>
      </BaseMenuItem>
      <BaseMenuItem>
        <div class="flex justify-between">
          <span class="mr-10 font-bold">{{ $t('apiAddress') }}</span>
          <span>{{ store.apiUrl }}</span>
        </div>
      </BaseMenuItem>
      <BaseMenuItem>
        <div class="flex justify-between">
          <span class="mr-10 font-bold">{{ $t('cdnAddress') }}</span>
          <span>{{ store.imageCdn }}</span>
        </div>
      </BaseMenuItem>
    </BaseMenu>
  </div>
</template>
