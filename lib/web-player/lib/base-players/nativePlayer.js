/** @import {Player} from './Public' */

import usePlayer from './player.js';

/**
 * @type Player
 */
const useNativePlayer = (mediaElement, opts) => {
  const {
    mediaControls,
    load,
    destroy,
    onPlayerError,
  } = usePlayer(mediaElement, opts);

  return {
    mediaControls,
    load,
    destroy,
    onPlayerError,
  };
};

export default useNativePlayer;
