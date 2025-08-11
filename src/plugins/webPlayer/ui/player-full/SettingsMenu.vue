<script setup lang="ts">
import { SCALE_PRESETS, SPEED_PRESETS } from '@/plugins/webPlayer/constants';
import { usePlayerInstance } from '@/plugins/webPlayer/instance';
import { MultiMenu, MultiMenuItem, MultiMenuSelection } from '@/plugins/webPlayer/ui/multi-menu';
import { usePlayerFullStore } from '@/plugins/webPlayer/ui/player-full/store';

const store = usePlayerFullStore();
const { mediaControls } = usePlayerInstance();
</script>

<template>
  <MultiMenu class="text-base">
    <MultiMenuSelection id="root">
      <MultiMenuItem @click.prevent="mediaControls.loop = !mediaControls.loop">
        <label v-focus class="flex justify-between">
          <span class="flex items-center">
            <span class="i-mingcute:repeat-fill button-icon-size mr-2" />
            <span>{{ $t('replay') }}</span>
          </span>
          <BaseToggle
            :checked="mediaControls.loop"
            color="primary"
            class="pointer-events-none"
          /></label>
      </MultiMenuItem>
      <MultiMenuItem v-if="mediaControls.supportsPictureInPicture" @click.prevent="mediaControls.togglePictureInPicture">
        <label v-focus class="flex justify-between">
          <span class="flex items-center">
            <span class="i-mingcute:external-link-line button-icon-size mr-2" />
            <span class="label-text">{{ $t('pictureInPicture') }}</span>
          </span>
          <BaseToggle
            :checked="mediaControls.isPictureInPicture"
            color="primary"
            class="pointer-events-none"
          /></label>
      </MultiMenuItem>
      <MultiMenuItem open-id="speed">
        <div v-focus class="flex justify-between">
          <div class="flex items-center">
            <Icon name="line-md-speed" class="button-icon-size mr-2" />
            <span>{{ $t('speed') }}</span>
          </div>
          <Icon name="line-md-chevron-right" />
        </div>
      </MultiMenuItem>
      <MultiMenuItem open-id="quality">
        <div v-focus class="flex justify-between">
          <div class="flex items-center">
            <span class="i-mingcute:settings-6-line button-icon-size mr-2" />
            <span>{{ $t('quality') }}</span>
          </div>
          <Icon name="line-md-chevron-right" />
        </div>
      </MultiMenuItem>
      <MultiMenuItem open-id="audio">
        <div v-focus class="flex justify-between">
          <div class="flex items-center">
            <span class="i-mingcute:settings-6-line button-icon-size mr-2" />
            <span>{{ $t('audioTrack') }}</span>
          </div>
          <Icon name="line-md-chevron-right" />
        </div>
      </MultiMenuItem>
      <MultiMenuItem>
        <div v-focus class="flex justify-between">
          <div class="flex items-center">
            <span class="i-mingcute:subtitle-fill button-icon-size mr-2" />
            <span>{{ $t('subtitles') }}</span>
          </div>
          <Icon name="line-md-chevron-right" />
        </div>
      </MultiMenuItem>
      <MultiMenuItem open-id="scale">
        <div v-focus class="flex justify-between">
          <div class="flex items-center">
            <span class="i-mingcute:scale-fill button-icon-size mr-2" />
            <span>{{ $t('scale') }}</span>
          </div>
          <Icon name="line-md-chevron-right" />
        </div>
      </MultiMenuItem>
    </MultiMenuSelection>

    <MultiMenuSelection id="speed">
      <MultiMenuItem>
        <div>
          <div class="col-start-1 col-end-3">
            <BaseSlider
              v-model="mediaControls.rate"
              color="primary"
              :min="0.5"
              :max="3"
              :step="0.1"
              class="w-full"
            />
          </div>
        </div>
      </MultiMenuItem>
      <MultiMenuItem modifer="disabled" class="mb-3" />
      <MultiMenuItem
        v-for="preset in SPEED_PRESETS"
        :key="preset.value"
        @click="mediaControls.rate = preset.value"
      >
        <div v-focus class="flex justify-start rounded-none">
          <span class="w-10 text-center text-sm">{{ preset.value }}x</span>
          <span>{{ $t(preset.locKey) }}</span>
        </div>
      </MultiMenuItem>
    </MultiMenuSelection>

    <MultiMenuSelection id="quality">
      <MultiMenuItem
        v-for="(level, index) in mediaControls.qualities"
        :key="level.name"
        @click="mediaControls.quality = index"
      >
        <div v-focus class="rounded-none">
          <span>{{ level.name }}</span>
        </div>
      </MultiMenuItem>
    </MultiMenuSelection>


    <MultiMenuSelection id="audio">
      <MultiMenuItem
        v-for="(level, index) in mediaControls.audioTracks"
        :key="level.name"
        @click="mediaControls.audioTrack = index"
      >
        <div v-focus class="rounded-none">
          <span>{{ level.name }}</span>
        </div>
      </MultiMenuItem>
    </MultiMenuSelection>

    <MultiMenuSelection id="scale">
      <MultiMenuItem>
        <div>
          <div class="col-start-1 col-end-3">
            <BaseSlider
              :value="store.customScaleValue ?? 1"
              color="primary"
              class="w-full"
              :min="0.5"
              :max="1.5"
              :step="0.01"
              @input="store.setScale({ mode: 'custom', value: parseFloat($event.target.value) })"
            />
          </div>
        </div>
      </MultiMenuItem>
      <MultiMenuItem modifer="disabled" class="mb-3" />
      <MultiMenuItem
        v-for="preset in SCALE_PRESETS"
        :key="preset.text"
        @click="() => store.setScale(preset)"
      >
        <div v-focus class="rounded-none">
          <span>{{ preset.text || $t(preset?.locKey as string) }}</span>
        </div>
      </MultiMenuItem>
    </MultiMenuSelection>
  </MultiMenu>
</template>

<style scoped>
.button {
  @apply w-4rem h-4rem;

  &-icon-size {
    @apply h-2rem w-2rem;
  }
}
</style>
