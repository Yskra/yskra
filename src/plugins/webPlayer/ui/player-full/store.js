import { useFullscreen } from '@vueuse/core';
import { acceptHMRUpdate, defineStore } from 'pinia';
import { computed, onMounted, ref } from 'vue';
import { SCALE_MODES } from '@/plugins/webPlayer/constants.js';
import { usePlayerInstance } from '@/plugins/webPlayer/instance';

// @todo https://github.com/libass/JavascriptSubtitlesOctopus


export const usePlayerFullStore = defineStore('webPlayer.fullPlayer', () => {
  const { errors } = usePlayerInstance();
  const _showRunButton = ref(false);
  const showRunButton = computed({
    get: () => _showRunButton.value && errors.size === 0,
    set: (value) => _showRunButton.value = value,
  });
  const { isFullscreen, toggle: toggleFullScreen } = useFullscreen();

  const openSettings = ref(false);
  const openPlaylist = ref(false);

  const scaleMode = ref('custom');
  const customScaleValue = ref(1);
  const videoStyle = computed(() =>
    SCALE_MODES[scaleMode.value].calc(customScaleValue.value),
  );

  onMounted(() => {
    showRunButton.value = true;
  });

  return {
    isFullscreen,
    toggleFullScreen,
    showRunButton,
    _showRunButton,

    openSettings,
    toggleSettings: () => openSettings.value = !openSettings.value,

    openPlaylist,
    togglePlaylist: () => openPlaylist.value = !openPlaylist.value,

    scaleMode,
    customScaleValue,
    videoStyle,
    setScale,
  };

  /**
   * @param {object} arg
   * @param {string} arg.mode
   * @param {number=} arg.value
   */
  function setScale({ mode, value }) {
    if (value) {
      customScaleValue.value = value;
    }
    scaleMode.value = mode;
  }
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(usePlayerFullStore, import.meta.hot));
}

