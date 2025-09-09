<script setup lang="ts">
import type { EntryLevel } from '@/modules/logger/Public';
import { computed } from 'vue';
import logMessage2str from '@/modules/logger/utils/logMessange2str';

const props = defineProps<{
  level: EntryLevel;
  message: unknown;
  date: Date;
}>();
const emit = defineEmits<{
  (e: 'openDetails', event: Event, msg: Msg): void;
}>();
const styles = Object.freeze({
  info: { bg: 'border-success' },
  warn: { bg: 'border-warning' },
  error: { bg: 'border-error' },
});
const style = computed(() => styles[props.level]);
const message = computed(() => logMessage2str(props.message));

interface Msg {
  title: string;
  full: string;
}
</script>

<template>
  <div class="my-2 flex items-center border-l-10 rounded-lg bg-base-200 p-2" :class="style.bg">
    <div class="w-full flex items-center justify-between">
      <div class="flex items-center">
        <BaseBadge
          size="sm"
          class="mr-2 p-3"
        >
          {{ props.date.toLocaleString(undefined, { timeStyle: 'medium' }) }}.{{ props.date.getMilliseconds() }}
        </BaseBadge>
        <h3 class="text-base">
          {{ message.title }}
        </h3>
      </div>
      <BaseButton
        v-if="message.full"
        size="sm"
        styling="active"
        @click="emit('openDetails', $event, message as Msg)"
      >
        {{ $t('details') }}
      </BaseButton>
    </div>
  </div>
</template>
