/** @import {Ref} from 'vue'; */
/** @import {Errors, Logger} from './Public'; */
/** @import {BasePlayer} from '../base-players/Public' */
/** @import {EventHook} from '@vueuse/core'; */

import { asyncComputed, createEventHook, toReactive } from '@vueuse/core';
import { computed, onWatcherCleanup, reactive, shallowRef, toRef, toValue, watch } from 'vue';
import { useDefaultPlayer } from '../base-players';
import LibraryError, { createUnsupportedError, ErrorType } from '../error';
import getMimeType, { FATAL_TYPE } from '../mime-type';
import validUrl from '../valid-url';
import { createPlayersStore } from './store';


/**
 * Create player controller, provide player media controls, errors handling and player source
 * @param {Ref<HTMLMediaElement | null | undefined>} element
 * @param {Logger} logger
 */
export default function createPlayerController(element, logger) {
  const player = shallowRef(useDefaultPlayer(element.value, { logger: window.console }));
  const src = shallowRef('');
  /** @type {Ref<string|null>} */
  const playerType = shallowRef(null); // by default player select automatically
  const mediaControls = toRef(() => player.value.mediaControls);

  const mimeType = asyncComputed(async () =>
    await getMimeType(src.value)
      .catch((err) => {
        // logger.warn(t('Cant get MIME-type for {type}', { type: src.value }), err);
        logger.warn(`Cant get MIME-type for ${src.value}`, err);
        return FATAL_TYPE;
      }), FATAL_TYPE);
  const playerFabric = computed(() => getPlayerFabric(src.value, mimeType.value, playerType.value));
  const playerOpts = shallowRef();
  const { addPlayer, removePlayer, findPlayer, getPlayerByName } = createPlayersStore(logger);

  /** @type {EventHook<LibraryError>} */
  const playerErrorEvent = createEventHook();
  /** @type {EventHook<Event>} */
  const sourceErrorEvent = createEventHook();
  /** @type {EventHook<Event>} */
  const playbackErrorEvent = createEventHook();
  /** @type {EventHook<LibraryError>} */
  const otherErrorEvent = createEventHook();

  /** @type {Errors} */
  const errors = reactive(new Set());


  watch([element, src, playerFabric], async ([el, source, playerFabric], [, prevSource]) => {
    if (!el || !source)
      return;

    onWatcherCleanup(() => {
      errors.clear();
      player.value?.destroy();
    });

    if (playerFabric === null) {
      await handlePlayerError(createUnsupportedError(mimeType.value));
      return;
    }

    try {
      await updatePlayerState(el, source, prevSource, playerFabric);
    }
    catch (/** @type {any} */ error) {
      await handlePlayerError(error);
    }
  }, { immediate: true });

  // @ts-ignore
  sourceErrorEvent.on((e) => errors.add({ detail: e.target.src, type: ErrorType.SOURCE }));
  playerErrorEvent.on((e) => errors.add({ detail: e, type: ErrorType.PLAYER }));
  playbackErrorEvent.on(() => errors.add({ detail: '', type: ErrorType.PLAYBACK }));
  otherErrorEvent.on((e) => errors.add({ detail: e, type: ErrorType.UNKNOWN }));

  return {
    player,
    playerType,
    playerOpts,
    src,
    errors,
    mediaControls: toReactive(mediaControls),
    onPlayerError: playerErrorEvent.on,
    onSourceError: sourceErrorEvent.on,
    onPlaybackError: playbackErrorEvent.on,
    onOtherError: otherErrorEvent.on,
    // criticalErrorEvent: (/** @type {LibraryError} */ e) => otherErrorEvent.trigger(e),
    addCustomPlayer: addPlayer,
    removeCustomPlayer: removePlayer,
  };

  /**
   * Update (recreate) player state with new source.
   * @param {HTMLMediaElement} el - The HTMLMediaElement to use.
   * @param {string} source - The new media source.
   * @param {string|undefined} prevSource
   * @param {BasePlayer} playerFabric
   */
  async function updatePlayerState(el, source, prevSource, playerFabric) {
    const playerControls = player.value.mediaControls;
    const currentTime = toValue(playerControls.currentTime);
    const ended = toValue(playerControls.ended);
    const loop = toValue(playerControls.loop);
    const muted = toValue(playerControls.muted);
    const playing = toValue(playerControls.playing);
    const rate = toValue(playerControls.rate);
    const volume = toValue(playerControls.volume);

    player.value = playerFabric.create(el, playerOpts.value);
    // logger.info(t('Player created: {name}', { name: playerFabric.name }));
    logger.info(`Player created: ${playerFabric.name}`);

    await player.value.load(source);

    // sync state if source is the same
    if (source === prevSource) {
      player.value.mediaControls.currentTime = currentTime;
      player.value.mediaControls.ended = ended;
    }

    // sync state
    player.value.mediaControls.loop = loop;
    player.value.mediaControls.muted = muted;
    player.value.mediaControls.playing = playing;
    player.value.mediaControls.rate = rate;
    player.value.mediaControls.volume = volume;

    setupPlayerEventListeners();
  }

  /**
   * Set up event listeners for player errors.
   */
  function setupPlayerEventListeners() {
    player.value.mediaControls.onSourceError(sourceErrorEvent.trigger);
    player.value.mediaControls.onPlaybackError(playbackErrorEvent.trigger);
    player.value.onPlayerError(playerErrorEvent.trigger);
  }

  /**
   * @param {Error|LibraryError} error - The error to handle.
   */
  async function handlePlayerError(error) {
    await playerErrorEvent.trigger(error instanceof LibraryError ? error : new LibraryError(error.message, ErrorType.CREATE_PLAYER, { originalError: error }));
  }

  /**
   * Detect player by source
   * @param {string} src - source url
   * @param {string} mimeType
   * @param {string|null} playerType
   * @returns {BasePlayer|null} player
   */
  function getPlayerFabric(src, mimeType, playerType = null) {
    // errors.value = [];

    if (!src) {
      return null;
    }
    if (!validUrl(src)) {
      otherErrorEvent.trigger(new LibraryError('Invalid URL', ErrorType.VALIDATION, {
        url: src,
        i18nTemplate: ['Invalid URL "{url}"', { url: src }],
      }));
      return null;
    }

    const url = new URL(src);

    if (playerType) {
      const player = getPlayerByName(playerType);

      if (player) {
        return player;
      }
      else {
        // logger.warn(t('Force selected player {name} not found, or not or not registered yet. Skipping.', { name: playerType }));
        logger.warn(`Force selected player ${playerType} not found, or not or not registered yet. Skipping.`);
      }
    }

    const player = findPlayer((p) => p.canPlay(url, mimeType));

    return player ?? null;
  }
}
