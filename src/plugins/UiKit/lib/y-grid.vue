<script setup lang="ts">
import type { RouteLocationRaw } from 'vue-router';
import { UseImage } from '@vueuse/components';


// todo virtual scroll
// maybe https://github.com/Akryum/vue-virtual-scroller/blob/master/packages/vue-virtual-scroller/README.md ?

interface Item {
  id?: number | string;
  title?: string;
  image?: string;
  releaseDate?: Date;
  voteAverage?: number;
  backdropImage?: string;
  link?: RouteLocationRaw;
}

export interface Props {
  items: Item[];
}

defineProps<Props>();
</script>

<template>
  <div v-focus-section class="y-grid">
    <div class="flex flex-wrap">
      <div
        v-for="item in items"
        :key="item.id"
        :data-item-id="item.id"
        class="h-77 w-52 p-2 carousel-item"
      >
        <AppLink :to="item.link ?? '/'" class="w-full bg-base-300 shadow-xl card">
          <BaseSkeleton v-if="!item.image || !item.title || !item.id" class="h-full w-full" />

          <UseImage
            v-else
            :src="item.image"
            class="poster h-full card"
          >
            <template #loading>
              <div class="poster my-20 h-30 w-45" />
            </template>
            <template #error>
              <div class="poster i-mingcute:pic-fill my-20 h-30 w-45" />
            </template>
          </UseImage>

          <span v-if="item?.title" class="m-2 overflow-hidden text-ellipsis text-start text-nowrap text-sm">
            {{ item.title }}
          </span>
        </AppLink>
      </div>
    </div>
  </div>
</template>

<style scoped>
.y-grid {
  @apply w-full relative flex items-center justify-center;
}
</style>
