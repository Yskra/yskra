<script setup lang="ts">
import type { Item } from './Public';
import { UseImage } from '@vueuse/components';

defineProps<{
  item: Item;
}>();
</script>

<template>
  <div class="r-carousel-item h-full w-full bg-base-100 shadow-xl card" :class="{ no_overlay: !item.backdropImage && !item.releaseDate }">
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

    <div v-if="item.backdropImage || item.releaseDate" class="backdrop absolute h-full w-full overflow-hidden op-0 card">
      <div class="backdrop-overlay" />

      <div class="absolute left-5 top-15 text-base">
        <h1 class="mb-2">
          {{ item.title }}
        </h1>
        <p>
          <span>{{ item.releaseDate?.getFullYear() }}</span>
          <span> • </span>
          <span>{{ item.voteAverage?.toFixed(1) }}</span>
        </p>
      </div>

      <div class="h-full w-130 rounded-tl-xl rounded-tr-xl">
        <UseImage
          v-if="item.backdropImage"
          :src="item.backdropImage"
          class="h-full w-full"
        >
          <template #error>
            <div />
          </template>
        </UseImage>
      </div>
    </div>

    <span v-if="item?.title" class="m-2 overflow-hidden text-ellipsis text-start text-nowrap text-sm">
      {{ item.title }}
    </span>
  </div>
</template>

<style scoped>
.r-carousel-item {
  @apply w-45;
  transition: width 200ms ease-in-out;
  transition-delay: 100ms;

  .poster {
    transition: opacity 750ms;
    transition-delay: 100ms;
  }
  .backdrop {
    transition: opacity 100ms;
    transition-delay: 100ms;

    .backdrop-overlay {
      @apply h-full w-full absolute top-0;
      background: radial-gradient(at center top, rgba(0, 0, 0, 0.03), rgba(0, 0, 0, 0.6), transparent 500px);
    }
  }
}

:global(.carousel-item *:focus) {
  outline-offset: 0.2rem;
  outline: var(--color-neutral-content) solid 0.3rem;
  border-radius: var(--radius-field);
}
</style>
