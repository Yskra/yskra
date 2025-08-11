/** @import {MediaControls, Player} from './Public' */

import { createEventHook, useMediaControls } from '@vueuse/core';
import { computed, reactive, ref, watchEffect } from 'vue';

/**
 * @abstract
 * @type Player
 */
function usePlayer(mediaElement, { logger }) {
  const mediaControls = useMediaControls(mediaElement);

  const loop = ref(false);
  const playerErrorEvent = createEventHook();

  /** @type {MediaControls} */
  const enhancedMediaControls = reactive({
    ...mediaControls,
    togglePlay: () => mediaControls.playing.value = !mediaControls.playing.value,
    toggleMute: () => mediaControls.muted.value = !mediaControls.muted.value,
    loop,
    endBuffer: computed(() => mediaControls.buffered.value.length ? mediaControls.buffered.value.at(-1)?.[1] ?? 0 : 0),
  });

  watchEffect(() => {
    if (mediaElement) {
      mediaElement.loop = loop.value;
    }
  });

  /**
   * Загрузка источника — заглушка для реализации в конкретных плеерах
   */
  async function load() {
    logger.warn('Load method is not implemented');
  }

  function destroy() {
    // Очистка ресурсов
  }

  return {
    mediaControls: enhancedMediaControls,
    load,
    destroy,
    onPlayerError: playerErrorEvent.on,
  };
}

export default usePlayer;
