/** @import {BasePlayer, UseLogger} from './Public' */

import { MIME_TYPES } from './constants';
import useDashPlayer from './dashPlayer.js';
import useHLSPlayer from './HlsPlayer.js';
import useNativePlayer from './nativePlayer.js';
import useYoutubePlayer from './youtubePlayer.js';

const $video = document.createElement('video');
const $audio = document.createElement('audio');
const nativeSupportHals = !$video.canPlayType(MIME_TYPES.HLS);

export { useNativePlayer as useDefaultPlayer };

/**
 *
 * @param {UseLogger} useLogger
 * @return {BasePlayer[]}
 */
export function createBasePlayers(useLogger) {
  return [
    {
      name: 'hls',
      canPlay: (url, mimeType) => {
        if (!nativeSupportHals) {
          return false;
        }
        return url.pathname.endsWith('.m3u8') || mimeType === MIME_TYPES.HLS;
      },
      create: (element, opts) =>
        useHLSPlayer(element, { ...opts, logger: useLogger('HLS') }),
    },
    {
      name: 'dash',
      canPlay: (url, mimeType) => {
        return url.pathname.endsWith('.mpd') || mimeType === MIME_TYPES.MPEG_DASH;
      },
      create: (element, opts) =>
        useDashPlayer(element, { ...opts, logger: useLogger('DASH') }),
    },
    {
      name: 'youtube',
      canPlay: (url) => {
        return url.hostname.includes('youtube.com');
      },
      create: (element, opts) =>
        useYoutubePlayer(element, { ...opts, logger: useLogger('YouTube') }),
    },
    {
      name: 'native',
      canPlay: (_, mimeType) => {
        return $video.canPlayType(mimeType) !== '' || $audio.canPlayType(mimeType) !== '';
      },
      create: (element, opts) =>
        useNativePlayer(element, { ...opts, logger: useLogger('Native') }),
    },
  ];
}
