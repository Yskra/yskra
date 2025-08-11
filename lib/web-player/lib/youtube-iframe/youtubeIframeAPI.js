/** @import {Ref, MaybeRefOrGetter} from 'vue'; */
// noinspection SpellCheckingInspection

import { createEventHook, watchIgnorable } from '@vueuse/core';
import { computed, ref, shallowRef, toValue } from 'vue';

const YT_EMBED_ENDPOINT = 'https://www.youtube-nocookie.com/embed/';

// player states
// -1 – unstarted
// 0 – ended
// 1 – playing
// 2 – paused
// 3 – buffering
// 5 – video cued

/**
 * Wrap YouTube's iframe API to useMediaControls-like API
 * @param {MaybeRefOrGetter<HTMLIFrameElement>} iframe
 */
export function useYoutubeIframeAPI(iframe) {
  iframe = toValue(iframe);

  const sourceLoadedEvent = createEventHook();
  const playerIsReadyEvent = createEventHook();
  const sourceErrorEvent = createEventHook();
  const playbackErrorEvent = createEventHook();

  sourceLoadedEvent.on(postIframeLoaded);
  window.addEventListener('message', messageListener);

  iframe.addEventListener('load', async (event) => {
    await sourceLoadedEvent.trigger(event);
  });

  const currentTime = shallowRef(0);
  const duration = shallowRef(0);
  const seeking = shallowRef(false); // not provided by iframe API
  const volume = shallowRef(1);
  const waiting = shallowRef(false);
  const ended = shallowRef(false);
  const playing = shallowRef(false);
  const rate = shallowRef(1);
  const stalled = shallowRef(false); // not provided by iframe API
  /** @type {Ref<[number, number][]>} */
  const buffered = ref([]);
  const tracks = ref([]); // not provided by iframe API
  const selectedTrack = shallowRef(-1); // not provided by iframe API
  const isPictureInPicture = shallowRef(false); // not provided by iframe API
  const muted = shallowRef(false);
  const loop = shallowRef(false); // not provided by iframe API
  const qualities = shallowRef([]); // not provided by iframe API
  const quality = shallowRef(0); // not provided by iframe API

  const { ignoreUpdates: ignoreSeekingUpdates } = watchIgnorable(currentTime, (time) => {
    command('seekTo', [time, true]);
  });
  const { ignoreUpdates: ignorePlayingUpdates } = watchIgnorable(playing, (isPlaying) => {
    if (isPlaying) {
      command('playVideo');
    }
    else {
      command('pauseVideo');
    }
  });
  const { ignoreUpdates: ignoreRateUpdates } = watchIgnorable(rate, (rate) => {
    command('setPlaybackRate', [rate]);
  });
  const { ignoreUpdates: ignoreVolumeUpdates } = watchIgnorable(volume, (volume) => {
    command('setVolume', [volume * 100]);
  });
  const { ignoreUpdates: ignoreMuteUpdates } = watchIgnorable(muted, (isMuted) => {
    if (isMuted) {
      command('mute');
    }
    else {
      command('unMute');
    }
  });

  const iframeReady = new Promise((resolve) => {
    const { off } = sourceLoadedEvent.on(() => {
      resolve(true);
      off();
    });
  });
  const playerReady = new Promise((resolve) => {
    const { off } = playerIsReadyEvent.on(() => {
      resolve(true);
      off();
    });
  });

  return {
    currentTime,
    duration,
    waiting,
    seeking,
    ended,
    stalled,
    buffered,
    playing,
    rate,
    loop,
    togglePlay: () => playing.value = !playing.value,
    toggleMute: () => muted.value = !muted.value,
    endBuffer: computed(() => buffered.value.length ? buffered.value.at(-1)?.[1] ?? 0 : 0),

    // Volume
    volume,
    muted,

    // Tracks
    tracks,
    selectedTrack,
    enableTrack: () => null,
    disableTrack: () => null,

    // Qualities
    qualities,
    quality,

    // Picture in Picture
    supportsPictureInPicture: false,
    togglePictureInPicture: () => Promise.resolve(),
    isPictureInPicture,

    // Events
    onSourceError: sourceErrorEvent.on,
    onPlaybackError: playbackErrorEvent.on,

    // iframe
    command,
    loadSource,
  };

  /**
   * Send command to the iframe
   * @param {string} command
   * @param {any[]=} args
   */
  function command(command, args) {
    const el = toValue(iframe);

    el.contentWindow?.postMessage(JSON.stringify({
      event: 'command',
      func: command,
      args: args || [],
    }), '*');
  }

  /**
   * @param {string} source https://youtu.be/xxxxxxx or https://www.youtube.com/watch?v=xxxxxxx
   * @return {Promise<void>}
   */
  async function loadSource(source) {
    const el = toValue(iframe);
    const sourceUrl = new URL(source);
    const id = sourceUrl.searchParams.get('v') || sourceUrl.pathname.split('/').at(-1);
    const params = new URLSearchParams({
      enablejsapi: '1',
      rel: '0',
      autoplay: '0',
      controls: '0',
    });
    const src = new URL(`${id}?${params}`, YT_EMBED_ENDPOINT);

    el.setAttribute('allow', 'accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share');
    el.setAttribute('frameborder', '0');
    el.src = src.toString();

    await iframeReady;
    await playerReady;
  }

  /**
   * Signal YouTube to send events
   */
  function postIframeLoaded() {
    const el = toValue(iframe);

    setTimeout(() => {
      el.contentWindow?.postMessage('{"event":"listening"}', '*');
    });
  }

  /**
   * Handle messages from the iframe to make state reactive
   * @param {MessageEvent} event
   */
  function messageListener(event) {
    const el = toValue(iframe);

    if (event.source !== el.contentWindow || !event.data) {
      return;
    }
    let eventData;

    try {
      eventData = JSON.parse(event.data);
    }
    catch {
      return;
    }

    const { info, event: eventName } = eventData;

    if (eventName === 'onReady') {
      return playerIsReadyEvent.trigger();
    }
    if (eventName !== 'infoDelivery') {
      return;
    }

    if ('currentTime' in info) {
      ignoreSeekingUpdates(() => currentTime.value = info.currentTime);
    }
    if ('duration' in info) {
      duration.value = info.duration;
    }
    if ('playbackRate' in info) {
      ignoreRateUpdates(() => rate.value = info.playbackRate);
    }
    if ('playerState' in info) {
      switch (info.playerState) {
        case 0:
          ended.value = true;
          break;

        case 1:
          waiting.value = false;
          ended.value = false;
          ignorePlayingUpdates(() => playing.value = true);
          break;

        case 2:
          ignorePlayingUpdates(() => playing.value = false);
          break;

        case 3:
          waiting.value = true;
          ignorePlayingUpdates(() => playing.value = false);
          break;
      }
    }

    if ('muted' in info) {
      ignoreMuteUpdates(() => muted.value = info.muted);
    }

    if ('volume' in info) {
      ignoreVolumeUpdates(() => volume.value = info.volume / 100);
    }

    if ('videoLoadedFraction' in info) {
      buffered.value = [
        [0, info.videoLoadedFraction * info.duration],
      ];
    }
  }
}
