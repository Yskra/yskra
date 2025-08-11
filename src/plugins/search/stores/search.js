/** @import {Ref} from 'vue' */
/** @import {SearchUserProfile} from '../Public'; */

import { acceptHMRUpdate, defineStore } from 'pinia';
import { computed, ref } from 'vue';
import { MAX_HISTORY_ENTRIES } from '@/plugins/search/constants.js';

/** @type {Ref<SearchUserProfile>} */
const profile = ref({ history: [] });

export const useSearchStore = defineStore('search.main', () => {
  const searchHistory = computed(() => [...profile.value.history]);

  return {
    setProfile: (/** @type {SearchUserProfile} */ v) => {
      profile.value = v;
    },

    searchHistory,
    addHistoryEntry,
    removeHistoryEntry,
  };

  /**
   * Add record to history and remove old records
   * @param {string} entry
   */
  function addHistoryEntry(entry) {
    if (!entry || profile.value.history.includes(entry)) {
      return;
    }

    profile.value.history.push(entry);

    if (profile.value.history.length > MAX_HISTORY_ENTRIES) {
      profile.value.history.pop();
    }
  }

  /**
   * Remove manual entry from history
   * @param {number} i
   */
  function removeHistoryEntry(i) {
    if (i > -1) {
      profile.value.history.splice(i, 1);
    }
  }
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useSearchStore, import.meta.hot));
}
