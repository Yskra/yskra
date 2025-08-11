<script setup lang="ts">
export interface Props {
  voteAverage?: number;
  certification?: string;
  isLoading: boolean;
}

defineOptions({
  inheritAttrs: false,
});

defineProps<Props>();
</script>

<template>
  <div class="film-card-ratings">
    <div v-if="certification" class="mr-2">
      <BaseBadge styling="dash" color="accent">
        <span>{{ certification }}</span>
      </BaseBadge>
    </div>
    <BaseSkeleton v-if="isLoading" class="h-6 w-15" />

    <div v-if="voteAverage">
      <BaseBadge color="accent">
        <span class="font-bold">{{ voteAverage.toFixed(1) }}</span>
        <span>TMDB</span>
      </BaseBadge>
    </div>
    <BaseSkeleton v-if="isLoading" class="h-6 w-15" />
  </div>
</template>

<style scoped>
.film-card-ratings {
  @apply flex items-center my-0.5;
}
</style>

