/** @typedef {{titleTemplate?: string | Function}} Options */
/** @import {WatchSource} from 'vue' */
import { onActivated, onBeforeUnmount, onDeactivated, toRef, toValue, watch } from 'vue';

/**
 * Reactive document title. With activate/deactivate support.
 * @param {WatchSource} newTitle new title
 * @param {Options} options options
 */
export function useTitle(newTitle, options = {}) {
  const title = toRef(newTitle ?? document?.title ?? null);

  /**
   * @param {string} t title
   */
  function format(t) {
    if (!('titleTemplate' in options))
      return t;
    const template = options.titleTemplate || '%s';

    return typeof template === 'function'
      ? template(t)
      : toValue(template).replace(/%s/g, t);
  }

  const { stop, pause, resume } = watch(
    title,
    (value, oldValue) => {
      if (value !== oldValue && document)
        document.title = format(typeof value === 'string' ? value : '');
    },
    { immediate: true, flush: 'sync' },
  );

  onBeforeUnmount(() => {
    stop();
  });
  onActivated(() => {
    resume();
  });
  onDeactivated(() => {
    pause();
  });

  return title;
}
