const DBLCLICK = 300;

/**
 * Handle click (mouse) and tap (mobile) on player.
 * - click = play/pause
 * - double click = toggle fullscreen
 * - tap = show overlay
 * - double tap = play/pause
 * @param {() => void} showOverlay is show overlay
 * @param {() => void} toggleFullscreen is toggle fullscreen
 * @param {() => void} togglePlay is toggle play
 */
export function useClickHandler(showOverlay, toggleFullscreen, togglePlay) {
  let lastClickTime = 0;
  /** @type {ReturnType<typeof setTimeout>} */
  let clickTimeout;


  function handleMouseEvent() {
    const currentTime = Date.now();
    const timeSinceLastClick = currentTime - lastClickTime;

    if (timeSinceLastClick < DBLCLICK) {
      clearTimeout(clickTimeout);
      toggleFullscreen();
    }
    else {
      clickTimeout = setTimeout(() => {
        togglePlay();
      }, DBLCLICK);
    }

    lastClickTime = currentTime;
  }

  function handleTouchEvent() {
    const currentTime = Date.now();
    const timeSinceLastClick = currentTime - lastClickTime;

    if (timeSinceLastClick < DBLCLICK) {
      clearTimeout(clickTimeout);
      togglePlay();
    }
    else {
      clickTimeout = setTimeout(() => {
        showOverlay();
      }, DBLCLICK);
    }

    lastClickTime = currentTime;
  }

  /**
   * @param {PointerEvent} event mouse or touch event
   */
  return function (event) {
    if (event.pointerType === 'mouse') {
      handleMouseEvent();
    }
    else {
      handleTouchEvent();
    }
  };
}
