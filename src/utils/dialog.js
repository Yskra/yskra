// noinspection JSIgnoredPromiseFromCall
/** @import {MaybeRef} from '@vueuse/core'; */
/** @typedef {ReturnType<typeof useDialog>} DialogController */

import { createEventHook } from '@vueuse/core';
import { ref, toRef } from 'vue';

/**
 * @param {MaybeRef<boolean>} open open
 */
export function useDialog(open = ref(false)) {
  open = toRef(open);
  const closeHook = createEventHook();

  /**
   * @param {any=} data data
   */
  const close = (data) => {
    open.value = false;
    closeHook.trigger(data);
  };

  const reveal = async () => {
    open.value = true;
  };

  return {
    isOpened: toRef(() => open.value),
    onClose: closeHook.on,
    close,
    reveal,
  };
}
