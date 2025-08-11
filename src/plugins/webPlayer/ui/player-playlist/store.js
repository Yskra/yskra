/* eslint-disable unused-imports/no-unused-vars */
/** @import {Ref, Reactive} from 'vue' */
/** @import {List, ListItem} from './Public' */

import { acceptHMRUpdate, defineStore } from 'pinia';
import { reactive, shallowRef, toRef } from 'vue';
import { useI18n } from 'vue-i18n';
import IpTvPlaylistParserWorker from '@/plugins/webPlayer/workers/ipTvPlaylistParser?worker';
import createThreadProcessor from '@/utils/threadProcessor.js';
import { usePlayerInstance } from '../../instance';

/** @type {(s: string) => Promise<List>} */
const ipTvPlaylistParser = createThreadProcessor({ Worker: IpTvPlaylistParserWorker });

export const usePlayerPlaylistStore = defineStore('webPlayer.playlist', () => {
  const playerInstance = usePlayerInstance();
  /** @type {Ref<List>} */
  const list = shallowRef([]);
  /** @type {Reactive<string[]>} */
  const currentListUrls = reactive([]);
  const selectedPos = shallowRef(0);
  /** @type {Ref<ListItem>} */
  const current = toRef(() => list.value[selectedPos.value] || {});
  const { t } = useI18n();

  return {
    list,
    currentListUrls,
    selectedPos,
    current,
    initList,
  };

  /**
   * @param {string} url
   */
  async function initList(url) {
    if (currentListUrls.includes(url)) {
      return;
    }

    const parsedList = await ipTvPlaylistParser(url)
      .catch(() => {
        // playerInstance.criticalErrorEvent(new Error(t('playlistParsingError', { url, detail: error })));
        return null;
      });

    if (!parsedList) {
      return;
    }

    list.value.push(...parsedList.map((e) => ({ ...e, listUrl: url })));
    currentListUrls.push(url);
  }
});
if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(usePlayerPlaylistStore, import.meta.hot));
}

