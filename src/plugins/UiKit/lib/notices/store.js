/** @import {UINotification} from './Public' */
/** @import {UUID} from 'node:crypto'; */

import { acceptHMRUpdate, defineStore, storeToRefs } from 'pinia';
import { shallowReactive } from 'vue';
import { useUIKitConfigStore } from '@/plugins/UiKit/libConfig.js';
import generateUUID from '@/utils/generateUUID.js';

export const useNoticesStore = defineStore('ui.notices', () => {
  const { config } = storeToRefs(useUIKitConfigStore());

  /** @type {Map<UUID, UINotification>} */
  const notifications = shallowReactive(new Map());
  /** @type {Map<UUID, UINotification>} */
  const queue = shallowReactive(new Map());

  return {
    notifications,
    queue,
    pushNotification,
    removeNotification,
  };

  /**
   * @param {UINotification} notification
   * @returns {UUID} id of notification for manual remove
   */
  function pushNotification(notification) {
    const id = generateUUID();

    if (notifications.size < config.value.notifications.maxElements) {
      notifications.set(id, notification);
    }
    else {
      queue.set(id, notification);
    }

    return id;
  }

  /**
   * @param {UUID} id
   */
  function removeNotification(id) {
    if (notifications.has(id)) {
      notifications.delete(id);

      if (notifications.size < config.value.notifications.maxElements && queue.size > 0) {
        // @ts-ignore
        const [newId, newNotification] = queue.entries().next().value;

        queue.delete(newId);
        notifications.set(newId, newNotification);
      }
      return;
    }

    if (queue.has(id)) {
      queue.delete(id);
    }
  }
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useNoticesStore, import.meta.hot));
}
