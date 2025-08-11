/** @import {MaybeRefOrGetter} from 'vue' */

import { shallowRef, toRef, watch } from 'vue';
import { usePlayerPlaylistStore } from '@/plugins/webPlayer/ui/player-playlist/store.js';

/**
 * @param {MaybeRefOrGetter<string>} directUrl - direct url
 * @param {MaybeRefOrGetter<string>} listUrl - playlist url
 * @param {MaybeRefOrGetter<number>} position - playlist position
 */
export function useResolveSource(directUrl, listUrl, position) {
  directUrl = toRef(directUrl);
  listUrl = toRef(listUrl);
  position = toRef(position);

  const listStore = usePlayerPlaylistStore();
  const src = shallowRef('');

  watch([directUrl, listUrl, position], async ([directUrl, listUrl, position]) => {
    if (directUrl) {
      src.value = directUrl;
    }
    else if (listUrl) {
      await listStore.initList(listUrl);
      listStore.selectedPos = position ?? 0;

      src.value = listStore.current.url;
    }
  }, { immediate: true });

  return src;
}
