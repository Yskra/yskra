<script setup lang="ts">
import type { PlayerError } from 'player';
import type { ComputedRef } from 'vue';
import { PlayerErrorType } from 'player';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { playerRef, usePlayerInstance } from '../../instance';

defineProps<{
  videoStyle?: Record<string, string>;
}>();

const { t } = useI18n();
const { errors, mediaControls } = usePlayerInstance();

const errorsToLocale: ComputedRef<string[]> = computed(() => {
  return [...errors]
    .map(({ detail, type }) => {
      if (type === PlayerErrorType.PLAYER) {
        return playerError(detail as PlayerError);
      }
      else if (type === PlayerErrorType.SOURCE) {
        return sourceError(detail as string);
      }
      else if (type === PlayerErrorType.PLAYBACK) {
        return playbackError();
      }
      return detail as string;
    })
    .filter((message): message is string => Boolean(message));
});


function playerError(error: PlayerError): string {
  if (error.is(PlayerErrorType.UNSUPPORTED)) {
    return t('unsupportedFormat', { type: error.message });
  }
  else if (error.is(PlayerErrorType.CREATE_PLAYER)) {
    return t('createPlayerFailed', { detail: error.message });
  }
  else {
    return t('playerError', { detail: error.message });
  }
}

function sourceError(detail: string): string {
  return t('sourceError', { url: detail });
}

function playbackError(): null {
  // Не критическая ошибка, не показываем
  return null;
}
</script>

<template>
  <div class="relative h-full bg-black">
    <video
      ref="playerRef"
      class="h-full w-full"
      crossorigin="anonymous"
      :style="videoStyle"
    />

    <div v-if="errorsToLocale.length > 0" class="center rounded-lg bg-black/50 p3">
      <p class="text-center text-lg text-error font-bold">
        {{ $t('criticalPlayerErrors') }}
      </p>
      <p
        v-for="(error, idx) in errorsToLocale"
        :key="`${error}_${idx}`"
        class="my-2"
      >
        {{ error }}
      </p>
    </div>

    <BaseLoading v-if="mediaControls.waiting" class="center h-5em w-5em color-primary" />
  </div>
</template>

<style scoped>
.center {
  @apply absolute left-50% top-50% -translate-x-1/2 -translate-y-1/2;
}
</style>
