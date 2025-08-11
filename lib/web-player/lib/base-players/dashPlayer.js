/** @import {MediaPlayerErrorEvent, ManifestLoadedEvent} from 'dashjs' */
/** @import {Player} from './Public' */

import { createEventHook } from '@vueuse/core';
import { MediaPlayer, supportsMediaSource } from 'dashjs';
import { watchEffect } from 'vue';
import { createPlayerError, createUnsupportedError } from '../error';
import usePlayer from './player.js';

/** @type Player */
const useDashPlayer = (mediaElement, { logger }) => {
  hardwareSupport();

  const { mediaControls } = usePlayer(mediaElement, { logger });
  const playerErrorEvent = createEventHook();
  const dash = MediaPlayer().create();

  dash.on(MediaPlayer.events.ERROR, dashError);
  dash.on(MediaPlayer.events.MANIFEST_LOADED, dashManifestLoaded);

  watchEffect(() => {
    if (mediaElement) {
      dash.initialize(mediaElement);
    }
  });

  return {
    mediaControls,
    load,
    destroy,
    onPlayerError: playerErrorEvent.on,
  };

  /**
   * @param {string} src
   */
  async function load(src) {
    dash.attachSource(src);
  }

  function destroy() {
    if (dash) {
      dash.reset();
      dash.destroy();
    }
  }

  function hardwareSupport() {
    if (supportsMediaSource()) {
      return;
    }
    throw createUnsupportedError('MPEG DASH');
  }

  /**
   * @param {MediaPlayerErrorEvent} event
   */
  async function dashError({ error }) {
    await playerErrorEvent.trigger(createPlayerError(error.message, error.data));
  }

  /**
   * @param {ManifestLoadedEvent} event
   */
  function dashManifestLoaded({ data }) {
    logger.info(`Manifest loaded: ${'url' in data ? data.url : ''}`);
  }
};

export default useDashPlayer;
