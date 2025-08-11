/** @import {Ref} from 'vue' */
/** @import {HlsConfig, ErrorData, ManifestParsedData, ManifestLoadedData, LevelSwitchedData} from 'hls.js' */
/** @import {Player, MediaControls} from './Public' */

import { createEventHook } from '@vueuse/core';
import Hls, { ErrorTypes, Events } from 'hls.js';
import HlsWorkerUrl from 'hls.js/dist/hls.worker.js?url';
import { reactive, ref, watchEffect } from 'vue';
import { createPlayerError, createUnsupportedError } from '../error';
import usePlayer from './player.js';

/** @type {Partial<HlsConfig>} */
const options = {
  // testBandwidth: false,
  // debug: true,
  workerPath: HlsWorkerUrl, // When using the ESM version of the library (hls.mjs), this option is required in order for web workers to be used.
  capLevelToPlayerSize: true, // Making hls.js responsive
  // liveDurationInfinity: true,
};

/**
 * @type Player
 */
const useHLSPlayer = (mediaElement, { logger }) => {
  hardwareSupport();

  const { mediaControls } = usePlayer(mediaElement, { logger });
  const playerErrorEvent = createEventHook();

  const hls = new Hls(options);
  /** @type {Ref<{name: string}[]>} */
  const levels = ref([]);
  const level = ref(0);

  /** @type {MediaControls} */
  const mediaControlsWithQuality = reactive({
    ...mediaControls,
    // Qualities
    qualities: levels,
    quality: level,
  });

  hls.on(Events.ERROR, hlsError);
  hls.on(Events.MANIFEST_PARSED, hlsManifestParsed);
  hls.on(Events.MANIFEST_LOADED, hlsManifestLoaded);
  hls.on(Events.LEVEL_SWITCHED, levelSwitched);

  watchEffect(() => {
    if (mediaElement) {
      hls.attachMedia(mediaElement);
    }
  });

  return {
    // @ts-expect-error typescript extents Idiot
    mediaControlsWithQuality,
    load,
    destroy,
    onPlayerError: playerErrorEvent.on,
  };

  /**
   * @param {string} src
   */
  async function load(src) {
    hls.loadSource(src);
  }

  function destroy() {
    if (hls) {
      hls.destroy();
    }
  }

  function hardwareSupport() {
    if (Hls.isSupported()) {
      return;
    }
    throw createPlayerError('HTTP Live Streaming');
  }

  /**
   * @param {typeof Hls.Events.ERROR} _event
   * @param {ErrorData} data
   */
  async function hlsError(_event, data) {
    if (!data.fatal) {
      return;
    }


    switch (data.type) {
      case ErrorTypes.NETWORK_ERROR: {
        await playerErrorEvent.trigger(createUnsupportedError('Fatal network error encountered', data));
        break;
      }

      case ErrorTypes.MEDIA_ERROR: {
        await playerErrorEvent.trigger(createUnsupportedError('Fatal media error encountered', data));
        break;
      }

      default: {
        await playerErrorEvent.trigger(createUnsupportedError('Unhandled fatal error encountered', data));
        break;
      }
    }
  }

  /**
   * @param {typeof Hls.Events.MANIFEST_PARSED} _
   * @param {ManifestParsedData} data
   */
  function hlsManifestParsed(_, data) {
    logger.info(`Found ${data.levels.length} levels`);
    levels.value = data.levels;
  }

  /**
   * @param {typeof Hls.Events.MANIFEST_LOADED} _
   * @param {ManifestLoadedData} data
   */
  async function hlsManifestLoaded(_, data) {
    logger.info(`Manifest loaded: ${data.url}`);
  }

  /**
   * @param {typeof Hls.Events.LEVEL_SWITCHED} _
   * @param {LevelSwitchedData} data
   */
  function levelSwitched(_, data) {
    level.value = data.level;
  }
};

export default useHLSPlayer;
