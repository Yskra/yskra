<script setup lang="ts">
import { UseImage } from '@vueuse/components';

export interface Props {
  image?: string;
  overview?: string;
  title?: string;
  originalTitle?: string;
  isLoading: boolean;
}

defineOptions({
  inheritAttrs: false,
});

const { image = '' } = defineProps<Props>();
</script>

<template>
  <div class="film-card-hero">
    <div class="items-start p-0 hero-content">
      <UseImage
        v-if="!isLoading"
        :src="image"
        class="shadow-2xlb w-70 rounded-lg"
      >
        <template #error>
          <Icon name="line-md-image-twotone" class="h-100 w-90 rounded-lg bg-base-300" />
        </template>
      </UseImage>
      <BaseSkeleton v-if="isLoading" class="h-100 w-90" />

      <div class="w-full">
        <div>
          <slot name="top" />
        </div>

        <h1 class="text-5xl font-bold">
          {{ title }}
        </h1>
        <BaseSkeleton v-if="isLoading" class="mb-1 h-3rem w-100" />

        <h1 class="text-2xl op-80">
          {{ originalTitle }}
        </h1>
        <BaseSkeleton v-if="isLoading" class="h-1.5rem w-50" />

        <div class="my-3">
          <slot name="middle" />
        </div>

        <p class="my-5">
          {{ overview }}
        </p>
        <div v-if="isLoading" class="flex flex-col">
          <BaseSkeleton class="my-1 h-4 w-200" />
          <BaseSkeleton class="my-1 h-4 w-100" />
          <BaseSkeleton class="my-1 h-4 w-90" />
          <BaseSkeleton class="my-1 h-4 w-140" />
          <BaseSkeleton class="my-1 h-4 w-100" />
        </div>

        <div class="my-2">
          <slot name="bottom" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.film-card-hero {
  @apply hero text-lg items-start;
  @apply flex
}
</style>

