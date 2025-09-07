// noinspection JSIgnoredPromiseFromCall

import { acceptHMRUpdate, defineStore } from 'pinia';
import { computed, reactive } from 'vue';

// The store is needed to use layout/dialog component to keep the correct order of opening and closing dialogs,
// regardless of z-index and position in the DOM, 1 dialog (and 1 dropdown) will always be active
// (if you open several dialogs, the dropdown filter will constantly notice each other)

export const useDialogsStore = defineStore('uikit.dialogs', () => {
  /** @type {number[]} */
  const ids = reactive([]);
  const activeDialog = computed(() => ids.at(-1) ?? -1);

  return {
    ids,
    activeDialog,
    open,
    close,
  };

  function open() {
    const id = ids.length;

    ids.push(id);
    return id;
  }

  /**
   * @param {number} id
   */
  function close(id) {
    const i = ids.indexOf(id);

    if (i !== -1) {
      ids.splice(i, 1);
    }
  }
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useDialogsStore, import.meta.hot));
}
