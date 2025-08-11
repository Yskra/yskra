/** @import {Player} from './Public' */

import { reactive, shallowRef } from 'vue';
import { createUnsupportedError } from '../error';
import { useYoutubeIframeAPI } from '../youtube-iframe';

/**
 * @type Player
 */
const useYoutubePlayer = (mediaElement) => {
  hardwareSupport();

  const iframe = createIframe();
  const originalElement = mediaElement;
  const yt = useYoutubeIframeAPI(iframe);
  const disableUI = shallowRef(false);
  const mediaControls = reactive({ ...yt, disableUI });

  mediaElement?.parentNode?.replaceChild(iframe, mediaElement);

  return {
    mediaControls,
    load,
    destroy,
    onPlayerError: yt.onSourceError,
  };


  function createIframe() {
    const iframe = document.createElement('iframe');

    iframe.classList.add('w-full', 'h-full', 'pointer-events-none');

    return iframe;
  }

  function hardwareSupport() {
    if ('postMessage' in window) {
      return;
    }
    return createUnsupportedError('YouTube iframe');
  }

  /**
   * @param {string} src
   */
  async function load(src) {
    await yt.loadSource(src);
  }

  function destroy() {
    if (iframe && originalElement) {
      iframe.parentNode?.replaceChild(originalElement, iframe);
      iframe.remove();
    }
  }
};

export default useYoutubePlayer;
