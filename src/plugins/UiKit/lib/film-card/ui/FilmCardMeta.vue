<script setup lang="ts">
import { computed } from 'vue';
import IntlHelper from '@/utils/IntlHelper';

export interface Props {
  releaseDate?: Date;
  runtime?: Date;
  genres?: [{ id: unknown; name: string }];
  isLoading: boolean;
}

defineOptions({
  inheritAttrs: false,
});

const { runtime = null } = defineProps<Props>();

const endIn = computed(() => {
  if (!runtime) {
    return null;
  }

  const date = new Date();

  date.setHours(date.getHours() + runtime.getHours());
  date.setMinutes(date.getMinutes() + runtime.getMinutes());
  date.setSeconds(0);
  return date;
});
</script>

<template>
  <div>
    <p class="text-sm">
      <template v-if="releaseDate">
        <span>{{ releaseDate.getFullYear() }}</span>
        <span class="mx-2">•</span>
      </template>

      <template v-if="genres?.length">
        <span>{{ genres.map((e) => e.name).slice(0, 2).join(' ') }}</span>
        <span class="mx-2">•</span>
      </template>

      <template v-if="runtime">
        <span>{{ IntlHelper.dateToHMS(runtime) }}</span>
        <span class="mx-1" />
        <span v-if="endIn" class="op-60">{{ $t('endIn', { time: endIn.toLocaleTimeString(undefined, { hour: 'numeric', minute: 'numeric' }) }) }}</span>
      </template>
    </p>
  </div>
</template>

<style scoped>

</style>
