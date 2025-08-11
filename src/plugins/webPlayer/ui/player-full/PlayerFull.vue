<script setup lang="ts">
import { onKeyStroke, refAutoReset } from '@vueuse/core';
import { computed, ref, watchEffect } from 'vue';
import { usePlayerInstance } from '@/plugins/webPlayer/instance';
import BasePlayer from '../base-player';
import ControlsBottom from './ControlsBottom.vue';
import ControlsCenter from './ControlsCenter.vue';
import ControlsTop from './ControlsTop.vue';
import { useClickHandler } from './handleClick.js';
import { usePlayerFullStore } from './store';

const props = defineProps<{
  url: string;
  playerType: string;
  playerOpts: Record<string, unknown>;
}>();

const store = usePlayerFullStore();
const { mediaControls, src, playerType: _playerType, playerOpts: _playerOpts } = usePlayerInstance();
const autoHideOverlay = refAutoReset(false, 2000);
const alwaysShowOverlay = ref(false);
const showOverlay = computed(() => !store.showRunButton && (alwaysShowOverlay.value || autoHideOverlay.value || store.openSettings || store.openPlaylist));
const hideCursor = computed(() => !mediaControls.waiting && !store.showRunButton && !showOverlay.value);

const handleClick = useClickHandler(
  () => autoHideOverlay.value = true,
  () => store.toggleFullScreen(),
  () => mediaControls.togglePlay(),
);

watchEffect(() => {
  src.value = props.url;
  _playerType.value = props.playerType;
  _playerOpts.value = props.playerOpts;
});

onKeyStroke((event) => {
  if (store.showRunButton) {
    event.stopPropagation();
    event.preventDefault();
    return;
  }
  // allow use arrow keys to fast-forward/rewind
  if (event.key !== 'Enter' && !showOverlay.value) {
    return;
  }
  autoHideOverlay.value = true;
});
onKeyStroke(' ', () => mediaControls.togglePlay());
onKeyStroke('f', () => store.toggleFullScreen());
onKeyStroke('m', () => mediaControls.toggleMute());
onKeyStroke(['ArrowLeft', 'ArrowRight'], (event) => {
  if (event.target === document.body) {
    mediaControls.currentTime = (mediaControls.currentTime + (event.code === 'ArrowLeft' ? -5 : +5));
  }
});
</script>

<template>
  <div
    class="full-web-player h-vh"
    :class="{ 'cursor-none': hideCursor }"
    @mousemove="autoHideOverlay = true"
  >
    <div class="relative h-full overflow-hidden">
      <BasePlayer
        class="transition-all-500"
        :video-style="store.videoStyle"
        @pointerup.stop="handleClick"
      />

      <Transition v-if="!mediaControls.disableUI" name="overlay-top">
        <div
          v-if="showOverlay"
          class="overlay-top"
          @mouseenter="alwaysShowOverlay = true"
          @mouseleave="alwaysShowOverlay = false"
        >
          <ControlsTop />
        </div>
      </Transition>

      <div v-if="!mediaControls.disableUI" class="overlay-center">
        <ControlsCenter />
      </div>


      <Transition v-if="!mediaControls.disableUI" name="overlay-bottom">
        <div
          v-if="showOverlay"
          class="overlay-bottom"
          @mouseenter="alwaysShowOverlay = true"
          @mouseleave="alwaysShowOverlay = false"
        >
          <ControlsBottom />
        </div>
      </Transition>
    </div>
  </div>
</template>

<style scoped>
/*noinspection CssUnusedSymbol*/
.overlay-center {
  @apply absolute left-50% top-50% -translate-1/2;
}
/*noinspection CssUnusedSymbol*/
.playlist {
  &-enter-active {
    transition: opacity 1s ease, top .5s ease-in;
  }
  &-leave-active {
    transition: opacity 1s ease, top 1s ease-in;
  }
  &-enter-from, &-leave-to {
    opacity: 0;
    top: 0;
  }
}
/*noinspection CssUnusedSymbol*/
.overlay-top {
  @apply absolute top-0 w-full select-none bg-gradient-from-base-300 bg-gradient-to-b p-5;

  &-enter-active {
    transition: top .2s ease-in;
  }
  &-leave-active {
    transition: top .5s ease-in;
  }
}
/*noinspection CssUnusedSymbol*/
.overlay-bottom {
  @apply absolute bottom-0 w-full select-none bg-gradient-from-base-300 bg-gradient-to-t p-5;

  &-enter-active {
    transition: bottom .2s ease-in;
  }
  &-leave-active {
    transition: bottom .5s ease-in;
  }
}
</style>
