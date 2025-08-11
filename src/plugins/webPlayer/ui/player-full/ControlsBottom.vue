<script setup lang="ts">
import { usePlayerInstance } from '@/plugins/webPlayer/instance';
import formatPlayerTime from '@/plugins/webPlayer/utils/formatPlayerTime';
import PlayerPlaylist from '../player-playlist';
import PlayerSeekbar from '../player-seekbar.vue';
import SettingsMenu from './SettingsMenu.vue';
import { usePlayerFullStore } from './store';

const store = usePlayerFullStore();
const { mediaControls } = usePlayerInstance();
</script>

<template>
  <div class="w-full flex justify-between">
    <span>{{ formatPlayerTime(mediaControls.currentTime) }}</span>
    <span>{{ formatPlayerTime(mediaControls.duration) }}</span>
  </div>
  <PlayerSeekbar
    :elapsed-time="mediaControls.currentTime"
    :buffer-time="mediaControls.endBuffer"
    :max="mediaControls.duration"
    class="py-4"
    @set-time="(e: number) => mediaControls.currentTime = e"
  >
    <template #hoverTooltip="{ time }">
      <BaseTooltip
        placement="top"
        modifier="open"
        :data-tip="formatPlayerTime(time)"
      />
    </template>
  </PlayerSeekbar>
  <div
    v-focus-section.autofocus
    class="relative flex justify-between"
  >
    <div class="pointer-events-none absolute w-full flex justify-center">
      <div class="pointer-events-auto flex">
        <!--        <BaseTooltip :data-tip="'Предыдущее' + ' (Shift + B)'"> -->
        <!--          <BaseButton class="button" color="primary"> -->
        <!--            <span class="i-mingcute:skip-previous-fill button-icon-size" /> -->
        <!--          </BaseButton> -->
        <!--        </BaseTooltip> -->
        <BaseTooltip :data-tip="`${mediaControls.playing ? $t('pause') : $t('play')} (Space)`">
          <BaseButton
            class="button"
            color="primary"
            @click="mediaControls.togglePlay()"
          >
            <span :class="[mediaControls.ended ? 'i-mingcute:refresh-1-line' : mediaControls.playing ? 'i-mingcute:pause-fill' : 'i-mingcute:play-fill']" class="button-icon-size" />
          </BaseButton>
        </BaseTooltip>
        <!--        <BaseTooltip :data-tip="'Следующее' + ' (Shift + N)'"> -->
        <!--          <BaseButton class="button" color="primary"> -->
        <!--            <span class="i-mingcute:skip-forward-fill button-icon-size" /> -->
        <!--          </BaseButton> -->
        <!--        </BaseTooltip> -->
      </div>
    </div>
    <div class="flex items-center">
      <BaseTooltip placement="top" :data-tip="`${mediaControls.muted ? $t('unmute') : $t('mute')} (M)`">
        <BaseButton
          class="button mr-2"
          color="primary"
          @click="mediaControls.toggleMute"
        >
          <span v-if="mediaControls.muted" class="button-icon-size i-mingcute:volume-mute-fill" />
          <span v-else class="button-icon-size i-mingcute:volume-fill" />
        </BaseButton>
      </BaseTooltip>
      <div>
        <BaseSlider
          :value="mediaControls.muted ? 0 : mediaControls.volume"
          :max="1"
          :min="0"
          :step="0.1"
          color="primary"
          @input="mediaControls.volume = $event.target!.value"
        />
      </div>
    </div>
    <div class="flex">
      <BaseTooltip placement="top" :data-tip="`${store.isFullscreen ? $t('outFullScreen') : $t('fullScreen')} (F)`">
        <BaseButton
          class="button mr-2"
          color="primary"
          @click="store.toggleFullScreen"
        >
          <span v-if="store.isFullscreen" class="button-icon-size i-mingcute:fullscreen-exit-2-line" />
          <span v-else class="button-icon-size i-mingcute:fullscreen-2-line" />
        </BaseButton>
      </BaseTooltip>
      <BaseTooltip
        data-tip="Плейлист (P)"
      >
        <BaseButton
          class="button mr-2"
          color="primary"
          @click="store.togglePlaylist"
        >
          <div class="button-icon-size i-mingcute:playlist-2-fill" />
        </BaseButton>
      </BaseTooltip>
      <BaseTooltip placement="top" :data-tip="$t('settings')">
        <BaseButton
          class="button"
          color="primary"
          @click="store.toggleSettings"
        >
          <div :class="{ 'rotate-90': store.openSettings }" class="transition-all-500">
            <div class="button-icon-size i-mingcute:settings-5-fill" />
          </div>
        </BaseButton>
      </BaseTooltip>
    </div>
  </div>

  <YDrawer v-model:show="store.openSettings" :title="$t('playerSettings')">
    <SettingsMenu />
  </YDrawer>

  <YDrawer v-model:show="store.openPlaylist" :title="$t('playlist')">
    <PlayerPlaylist />
  </YDrawer>
</template>

<style scoped>
.button {
  @apply w-4rem h-4rem;

  &-icon-size {
    @apply h-2rem w-2rem;
  }
}
</style>

